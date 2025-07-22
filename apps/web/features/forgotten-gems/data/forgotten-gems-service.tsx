"use server";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import {
	and,
	auth,
	count,
	db,
	desc,
	gte,
	lte,
	sql,
	tracks,
} from "@repo/database";
import { spotify } from "@repo/spotify";

import type { MusicItemCardProps } from "~/components/cards/music-item-card/type";
import { getMsPlayedInMinutes } from "~/lib/utils";

import type { YearOption } from "../types";

export const getAvailableYears = async (
	userId: string,
): Promise<YearOption[]> => {
	const yearStats = await db
		.select({
			year: sql<number>`EXTRACT(YEAR FROM ${tracks.timestamp})`,
			track_count: count(),
		})
		.from(tracks)
		.where(auth(userId))
		.groupBy(({ year }) => year)
		.orderBy(({ year }) => desc(year));

	return yearStats.map((stat) => ({
		year: Number(stat.year),
		trackCount: Number(stat.track_count),
		label: `${stat.year} (${Number(stat.track_count).toLocaleString()} tracks)`,
	}));
};

interface TrackYearStats {
	spotifyId: string;
	year: number;
	playCount: number;
	totalTime: bigint;
}

interface ScoredTrack {
	spotifyId: string;
	year: number;
	playCount: number;
	totalTime: bigint;
	score: number;
	decayFactor: number;
}

export const getForgottenGems = async (
	userId: string,
	selectedYear?: number,
	yearRange?: { start: number; end: number },
): Promise<MusicItemCardProps["item"][]> => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "forgotten-gems");

	let N_MIN = 10;
	let N_MAX = 50;
	const DECAY_THRESHOLD = 0.2;
	const RESULTS_PER_YEAR = 40;

	let yearsToAnalyze: number[];
	if (selectedYear) {
		yearsToAnalyze = [selectedYear];
	} else if (yearRange) {
		yearsToAnalyze = Array.from(
			{ length: yearRange.end - yearRange.start + 1 },
			(_, i) => yearRange.start + i,
		);
	} else {
		const availableYears = await getAvailableYears(userId);
		yearsToAnalyze = availableYears.map((y) => y.year);
	}

	if (yearsToAnalyze.length === 0) return [];

	// Get per-track, per-year statistics for current and following years
	const allYearsToQuery = [
		...yearsToAnalyze,
		...yearsToAnalyze.map((y) => y + 1), // Include following years for decay analysis
		...yearsToAnalyze.map((y) => y + 2), // Include year+2 for deeper analysis
	];

	const trackYearStats = await getTrackYearStats(userId, allYearsToQuery);

	// Group by year for easier processing
	const statsByYear = trackYearStats.reduce<Record<number, TrackYearStats[]>>(
		(acc, stat) => {
			acc[stat.year] ??= [];
			acc[stat.year].push(stat);
			return acc;
		},
		{},
	);

	// Process each target year
	const allScoredTracks: ScoredTrack[] = [];

	for (const year of yearsToAnalyze) {
		const currentYearStats = statsByYear[year] || [];
		const nextYearStats = statsByYear[year + 1] || [];
		const year2Stats = statsByYear[year + 2] || [];

		if (currentYearStats.length === 0) continue;

		// Adaptive thresholds based on data
		const adaptiveThresholds = calculateAdaptiveThresholds(currentYearStats);
		N_MIN = Math.min(N_MIN, adaptiveThresholds.minPlays);
		N_MAX = Math.max(N_MAX, adaptiveThresholds.maxPlays);

		// Filter for moderate listening criteria
		const moderateListeningTracks = await filterModerateListing(
			currentYearStats,
			N_MIN,
			N_MAX,
		);

		if (moderateListeningTracks.length === 0) {
			// If no tracks pass moderate criteria, relax them further
			const relaxedTracks = currentYearStats.filter(
				(stat) => stat.playCount >= 2,
			);

			if (relaxedTracks.length > 0) {
				const scoredTracks = scoreTrackWithoutDecay(relaxedTracks, year);
				allScoredTracks.push(...scoredTracks);
			}
			continue;
		}

		// Identify forgotten tracks with 2-year analysis
		const forgottenTracks = identifyForgottenTracksAdvanced(
			moderateListeningTracks,
			nextYearStats,
			year2Stats,
			DECAY_THRESHOLD,
		);

		// If no forgotten tracks, use all moderate tracks with decay scoring
		if (forgottenTracks.length === 0) {
			const allModerateWithDecay = moderateListeningTracks.map(track => ({
				...track,
				nextYearPlays: nextYearStats.find(s => s.spotifyId === track.spotifyId)?.playCount || 0,
				year2Plays: year2Stats.find(s => s.spotifyId === track.spotifyId)?.playCount || 0,
			}));
			const scoredTracks = scoreTrackAdvanced(allModerateWithDecay, year);
			allScoredTracks.push(...scoredTracks);
		} else {
			// Score forgotten tracks with advanced scoring
			const scoredTracks = scoreTrackAdvanced(forgottenTracks, year);
			allScoredTracks.push(...scoredTracks);
		}
	}

	// Select top tracks per year and sort globally by score
	const topTracksByYear = new Map<number, ScoredTrack[]>();

	for (const track of allScoredTracks) {
		const yearTracks = topTracksByYear.get(track.year) || [];
		yearTracks.push(track);
		yearTracks.sort((a, b) => b.score - a.score);

		// Keep only top N per year
		if (yearTracks.length > RESULTS_PER_YEAR) {
			yearTracks.pop();
		}

		topTracksByYear.set(track.year, yearTracks);
	}

	// Flatten and get final selection
	const finalTracks = Array.from(topTracksByYear.values())
		.flat()
		.sort((a, b) => b.score - a.score)
		.slice(0, RESULTS_PER_YEAR * yearsToAnalyze.length);


	if (finalTracks.length === 0) return [];

	// Enrich with Spotify data
	return await enrichWithSpotifyData(finalTracks, userId);
};

/**
 * Calculate adaptive thresholds based on actual data distribution
 */
function calculateAdaptiveThresholds(yearStats: TrackYearStats[]): {
	minPlays: number;
	maxPlays: number;
} {
	const playCounts = yearStats
		.map((stat) => stat.playCount)
		.sort((a, b) => a - b);

	// Use 10th and 80th percentiles as adaptive bounds
	const minIndex = Math.floor(playCounts.length * 0.1);
	const maxIndex = Math.floor(playCounts.length * 0.8);

	return {
		minPlays: Math.max(2, playCounts[minIndex] || 2),
		maxPlays: Math.min(100, playCounts[maxIndex] || 20),
	};
}

/**
 * Score tracks without decay analysis (fallback method)
 */
function scoreTrackWithoutDecay(
	tracks: TrackYearStats[],
	year: number,
): ScoredTrack[] {
	if (tracks.length === 0) return [];

	// For fallback scoring, we still want to avoid the most popular tracks
	const playCounts = tracks.map((t) => t.playCount).sort((a, b) => b - a);
	const p90Threshold = playCounts[Math.floor(playCounts.length * 0.1)] || 1; // Top 10%

	// Filter out the most popular tracks even in fallback
	const filteredTracks = tracks.filter(
		(track) => track.playCount <= p90Threshold,
	);

	const maxPlays = Math.max(...filteredTracks.map((t) => t.playCount));

	return filteredTracks.map((track) => {
		const totalTimeMinutes = Number(track.totalTime) / (1000 * 60);
		const logTime = Math.log(Math.max(totalTimeMinutes, 1));

		// Apply popularity penalty even in fallback
		const popularityRatio = track.playCount / maxPlays;
		const popularityPenalty =
			popularityRatio > 0.5 ? 0.7 ** popularityRatio : 1.0;

		// Gem factor for quality listening
		const avgTimePerPlay = totalTimeMinutes / track.playCount;
		const gemFactor = avgTimePerPlay > 2.5 ? 1.2 : 1.0;

		const score =
			track.playCount * logTime * 0.6 * popularityPenalty * gemFactor; // Lower base decay factor for fallback

		return {
			spotifyId: track.spotifyId,
			year,
			playCount: track.playCount,
			totalTime: track.totalTime,
			score,
			decayFactor: 0.6,
		};
	});
}

/**
 * Get per-track, per-year statistics from the database
 */
async function getTrackYearStats(
	userId: string,
	years: number[],
): Promise<TrackYearStats[]> {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "forgotten-gems-all-years");

	const minYear = Math.min(...years);
	const maxYear = Math.max(...years);

	const results = await db
		.select({
			spotifyId: tracks.spotifyId,
			year: sql<number>`EXTRACT(YEAR FROM ${tracks.timestamp})`,
			playCount: count(),
			totalTime: sql<bigint>`SUM(${tracks.msPlayed})`,
		})
		.from(tracks)
		.where(
			and(
				auth(userId),
				gte(sql`EXTRACT(YEAR FROM ${tracks.timestamp})`, minYear),
				lte(sql`EXTRACT(YEAR FROM ${tracks.timestamp})`, maxYear),
			),
		)
		.groupBy(tracks.spotifyId, sql`EXTRACT(YEAR FROM ${tracks.timestamp})`)
		.having(({ playCount }) => gte(playCount, 10));

	return results.map((result) => ({
		spotifyId: result.spotifyId,
		year: Number(result.year),
		playCount: result.playCount,
		totalTime: result.totalTime,
	}));
}

/**
 * Filter tracks for moderate listening criteria
 */
async function filterModerateListing(
	yearStats: TrackYearStats[],
	nMin: number,
	nMax: number,
): Promise<TrackYearStats[]> {
	if (yearStats.length === 0) return [];

	// Calculate distribution statistics
	const playCounts = yearStats
		.map((stat) => stat.playCount)
		.sort((a, b) => a - b);
	const totalTimes = yearStats
		.map((stat) => Number(stat.totalTime))
		.sort((a, b) => a - b);

	// Calculate key percentiles
	const playCountPercentiles = {
		p10: playCounts[Math.floor(playCounts.length * 0.1)] || 0,
		p25: playCounts[Math.floor(playCounts.length * 0.25)] || 0,
		p50: playCounts[Math.floor(playCounts.length * 0.5)] || 0,
		p75: playCounts[Math.floor(playCounts.length * 0.75)] || 0,
		p90: playCounts[Math.floor(playCounts.length * 0.9)] || 0,
		p95: playCounts[Math.floor(playCounts.length * 0.95)] || 0,
	};

	// Define "moderate listening" as tracks that are:
	// 1. Not in bottom 10% (too few plays to be meaningful)
	// 2. Not in top 5% (too popular, likely year hits)
	// 3. Have reasonable listening time (not just skips)
	const minPlaysThreshold = Math.max(nMin, playCountPercentiles.p10);
	const maxPlaysThreshold = Math.min(nMax, playCountPercentiles.p95); // Exclude top 5% instead of including them
	const minTimeThreshold = totalTimes[Math.floor(totalTimes.length * 0.3)] || 0; // Exclude bottom 30% by time

	// Apply the filtering
	const filtered = yearStats.filter((stat) => {
		const meetsPlayCount =
			stat.playCount >= minPlaysThreshold &&
			stat.playCount <= maxPlaysThreshold;
		const meetsTimeThreshold = Number(stat.totalTime) >= minTimeThreshold;
		const notTooPopular = stat.playCount < playCountPercentiles.p90; // Extra safety: exclude top 10%

		return meetsPlayCount && meetsTimeThreshold && notTooPopular;
	});

	// If still no results, try a more targeted approach
	if (filtered.length === 0) {
		// Target the "sweet spot": 25th to 75th percentile by plays, but exclude the very top
		const targetFiltered = yearStats.filter((stat) => {
			const inSweetSpot =
				stat.playCount >= playCountPercentiles.p25 &&
				stat.playCount <= playCountPercentiles.p75;
			const hasDecentTime = Number(stat.totalTime) >= minTimeThreshold;
			return inSweetSpot && hasDecentTime;
		});

		return targetFiltered;
	}

	return filtered;
}

/**
 * Identify tracks that are "forgotten" (significantly less plays in following year)
 */
function identifyForgottenTracksAdvanced(
	currentYearTracks: TrackYearStats[],
	nextYearTracks: TrackYearStats[],
	year2Stats: TrackYearStats[],
	decayThreshold: number,
): Array<TrackYearStats & { nextYearPlays: number; year2Plays: number }> {
	const nextYearMap = new Map(
		nextYearTracks.map((stat) => [stat.spotifyId, stat.playCount]),
	);
	const year2Map = new Map(
		year2Stats.map((stat) => [stat.spotifyId, stat.playCount]),
	);

	return currentYearTracks
		.map((track) => {
			const nextYearPlays = nextYearMap.get(track.spotifyId) || 0;
			const year2Plays = year2Map.get(track.spotifyId) || 0;
			return { ...track, nextYearPlays, year2Plays };
		})
		.filter((track) => {
			const threshold = track.playCount * decayThreshold;
			return track.nextYearPlays <= threshold;
		});
}

/**
 * Score tracks based on play count, total time, and decay factor
 */
function scoreTrackAdvanced(
	tracksWithDecay: Array<
		TrackYearStats & { nextYearPlays: number; year2Plays: number }
	>,
	year: number,
): ScoredTrack[] {
	if (tracksWithDecay.length === 0) return [];

	// Calculate distribution for popularity penalty
	const playCounts = tracksWithDecay
		.map((t) => t.playCount)
		.sort((a, b) => b - a);
	const maxPlays = playCounts[0] || 1;

	return tracksWithDecay.map((track) => {
		const totalTimeMinutes = Number(track.totalTime) / (1000 * 60);

		// Calculate decay factor - reward tracks that completely disappeared
		let decayFactor: number;
		if (track.nextYearPlays === 0) {
			decayFactor = 1.0; // Perfect "forgotten" track
		} else {
			const dropOffRatio = track.nextYearPlays / track.playCount;
			// More nuanced decay calculation
			if (dropOffRatio <= 0.1)
				decayFactor = 0.95; // Nearly forgotten (90%+ drop)
			else if (dropOffRatio <= 0.2)
				decayFactor = 0.85; // Mostly forgotten (80%+ drop)
			else if (dropOffRatio <= 0.3)
				decayFactor = 0.75; // Significantly dropped (70%+ drop)
			else if (dropOffRatio <= 0.5)
				decayFactor = 0.6; // Moderate drop (50%+ drop)
			else decayFactor = Math.max(0.2, 1 - dropOffRatio); // Linear for smaller drops
		}

		// Popularity penalty - reduce score for tracks that were too popular
		const popularityRatio = track.playCount / maxPlays;
		const popularityPenalty =
			popularityRatio > 0.3 ? 0.5 ** (popularityRatio * 2) : 1.0;

		// "Gem factor" - boost tracks that have good listening time but moderate play count
		const avgTimePerPlay = totalTimeMinutes / track.playCount;
		const gemFactor = avgTimePerPlay > 2.5 ? 1.3 : 1.0; // Boost tracks where user listened through most of the song

		// Enhanced score formula
		const logTime = Math.log(Math.max(totalTimeMinutes, 1));
		const baseScore = track.playCount * logTime;
		const score = baseScore * decayFactor * popularityPenalty * gemFactor;

		return {
			spotifyId: track.spotifyId,
			year,
			playCount: track.playCount,
			totalTime: track.totalTime,
			score,
			decayFactor,
		};
	});
}

/**
 * Enrich scored tracks with Spotify metadata
 */
async function enrichWithSpotifyData(
	scoredTracks: ScoredTrack[],
	userId: string,
): Promise<MusicItemCardProps["item"][]> {
	const spotifyIds = scoredTracks.map((track) => track.spotifyId);

	// Set user context for Spotify API
	spotify.setUserId(userId);

	try {
		const trackDetails = await spotify.tracks.list(spotifyIds);

		return trackDetails
			.map((track) => {
				const scoredTrack = scoredTracks.find(
					(st) => st.spotifyId === track.id,
				);
				if (!scoredTrack) return null;

				const totalMinutes = getMsPlayedInMinutes(
					Number(scoredTrack.totalTime),
				);

				return {
					id: track.id,
					name: track.name,
					href: track.external_urls.spotify,
					image: track.album.images[0]?.url,
					artists: track.artists.map((artist) => artist.name).join(", "),
					stat1: `${totalMinutes} minutes`,
					stat2: `${scoredTrack.playCount} plays`,
					description: (
						<span
							key={`${track.id}-description`}
							className="text-muted-foreground text-xs"
						>
							Score: {scoredTrack.score.toFixed(1)}
						</span>
					),
				};
			})
			.filter(Boolean) as MusicItemCardProps["item"][];
	} catch (error) {
		console.error("Error enriching tracks with Spotify data:", error);
		return [];
	}
}
