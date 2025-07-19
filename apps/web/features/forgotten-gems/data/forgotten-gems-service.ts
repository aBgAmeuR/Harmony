"use server";

import {
	and,
	auth,
	count,
	db,
	desc,
	eq,
	gte,
	inArray,
	sql,
	tracks,
} from "@repo/database";
import { spotify } from "@repo/spotify";

import type { ForgottenGem, TrackPlayData, YearOption } from "../types";

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

export const getForgottenGems = async (
	userId: string,
	config: {
		selectedYear?: number;
		yearRange?: { start: number; end: number };
	},
) => {
	const now = new Date();

	// Calculate date range based on year selection
	const dateRange = calculateDateRange(config, now);

	// Get all track plays within the calculated date range
	const trackPlays = await getTrackPlaysData(
		userId,
		dateRange.start,
		dateRange.end,
	);

	// Group plays by track
	const trackGroups: Record<string, TrackPlayData[]> = trackPlays.reduce(
		(acc, play) => {
			if (!acc[play.spotifyId]) {
				acc[play.spotifyId] = [];
			}
			acc[play.spotifyId].push(play);
			return acc;
		},
		{} as Record<string, TrackPlayData[]>,
	);

	// Analyze each track
	const analyses: Record<string, ReturnType<typeof analyzeTrackPlays>> = {};
	for (const spotifyId of Object.keys(trackGroups)) {
		const plays = trackGroups[spotifyId];
		analyses[spotifyId] = analyzeTrackPlays(plays, now);
	}

	// Compute top 50 by totalMsPlayed
	const sortedByMs = Object.entries(analyses)
		.sort(([, a], [, b]) => b.totalMsPlayed - a.totalMsPlayed)
		.slice(0, 50);
	const top50Ids = new Set(sortedByMs.map(([id]) => id));

	// Get candidate ids: totalPlays >=10 and not top50
	const candidateIds = Object.entries(analyses)
		.filter(([id, analysis]) => analysis.totalPlays >= 10 && !top50Ids.has(id))
		.map(([id]) => id);

	// Check which have been played in last 365 days
	const recentThreshold = new Date(now);
	recentThreshold.setDate(recentThreshold.getDate() - 365);
	const recentPlays = await db
		.select({
			spotifyId: tracks.spotifyId,
			count: count(),
		})
		.from(tracks)
		.where(
			and(
				eq(tracks.userId, userId),
				inArray(tracks.spotifyId, candidateIds),
				gte(tracks.timestamp, recentThreshold),
			),
		)
		.groupBy(tracks.spotifyId);

	const recentIds = new Set(
		recentPlays.filter((r) => r.count > 0).map((r) => r.spotifyId!),
	);

	// Filter candidates not recent
	const finalCandidateIds = candidateIds.filter((id) => !recentIds.has(id));

	// Enrich with Spotify data
	const spotifyTracks = await spotify.tracks.list(finalCandidateIds);
	const spotifyMap = new Map(spotifyTracks.map((t) => [t.id, t]));

	// Calculate scores and create gems
	const gems: ForgottenGem[] = [];
	for (const id of finalCandidateIds) {
		const analysis = analyses[id];
		const spot = spotifyMap.get(id);
		if (!spot) continue;

		const plays = trackGroups[id];
		const numComplete = plays.filter((p) => p.reasonEnd === "trackdone").length;
		const completionRate = numComplete / analysis.totalPlays;
		const affinityScore =
			analysis.totalMsPlayed *
			completionRate *
			Math.log(analysis.totalPlays + 1);

		gems.push({
			spotifyId: id,
			name: spot.name,
			artists: spot.artists.map((a) => a.name),
			albumName: spot.album.name || "",
			image: spot.album.images[0]?.url || "",
			spotifyUrl: spot.external_urls.spotify,
			durationMs: spot.duration_ms,
			totalPlays: analysis.totalPlays,
			totalMsPlayed: analysis.totalMsPlayed,
			firstPlayed: analysis.firstPlayed,
			lastPlayed: analysis.lastPlayed, // this is period last, but ok for now
			daysSinceLastPlayed: analysis.daysSinceLastPlayed, // period based, but since we filtered global, it's at least 365
			reasonScore: affinityScore,
		});
	}

	// Sort by score desc and limit 50
	gems.sort((a, b) => (b.reasonScore || 0) - (a.reasonScore || 0));
	return gems.slice(0, 50);
};

/**
 * Calculate date range based on year selection
 */
function calculateDateRange(
	config: {
		selectedYear?: number;
		yearRange?: { start: number; end: number };
	},
	now: Date,
) {
	let startDate: Date;
	let endDate: Date;

	if (config.selectedYear) {
		// Single year selection
		startDate = new Date(config.selectedYear, 0, 1); // January 1st
		endDate = new Date(config.selectedYear + 1, 0, 1); // January 1st of next year
	} else if (config.yearRange) {
		// Year range selection
		startDate = new Date(config.yearRange.start, 0, 1);
		endDate = new Date(config.yearRange.end + 1, 0, 1);
	} else {
		// Default: use lookback period from now
		startDate = new Date(now);
		startDate.setDate(startDate.getDate() - 365);
		endDate = now;
	}

	return { start: startDate, end: endDate };
}

/**
 * Fetch all track play data for analysis
 */
async function getTrackPlaysData(
	userId: string,
	startDate: Date,
	endDate: Date,
): Promise<TrackPlayData[]> {
	const data = await db
		.select({
			spotifyId: tracks.spotifyId,
			timestamp: tracks.timestamp,
			msPlayed: tracks.msPlayed,
			skipped: tracks.skipped,
			reasonEnd: tracks.reasonEnd,
		})
		.from(tracks)
		.where(
			auth(userId, { monthRange: { dateStart: startDate, dateEnd: endDate } }),
		)
		.orderBy(tracks.timestamp);

	return data.map((track) => ({
		spotifyId: track.spotifyId,
		timestamp: track.timestamp,
		msPlayed: Number(track.msPlayed),
		skipped: track.skipped ?? false,
		reasonEnd: track.reasonEnd,
	}));
}

function _analyzeTrackPatterns(
	trackPlays: TrackPlayData[],
	now: Date,
): Partial<ForgottenGem>[] {
	// Group plays by track
	const trackGroups = trackPlays.reduce(
		(acc, play) => {
			if (!acc[play.spotifyId]) {
				acc[play.spotifyId] = [];
			}
			acc[play.spotifyId].push(play);
			return acc;
		},
		{} as Record<string, TrackPlayData[]>,
	);

	const candidates: Partial<ForgottenGem>[] = [];

	for (const [spotifyId, plays] of Object.entries(trackGroups)) {
		const analysis = analyzeTrackPlays(plays, now);

		candidates.push({
			spotifyId,
			...analysis,
		});
	}

	return candidates;
}

function analyzeTrackPlays(plays: TrackPlayData[], now: Date) {
	const sortedPlays = plays.sort(
		(a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
	);

	const firstPlayed = sortedPlays[0].timestamp;
	const lastPlayed = sortedPlays[sortedPlays.length - 1].timestamp;
	const daysSinceLastPlayed = Math.floor(
		(now.getTime() - lastPlayed.getTime()) / (1000 * 60 * 60 * 24),
	);

	const totalPlays = plays.length;
	const totalMsPlayed = plays.reduce((sum, play) => sum + play.msPlayed, 0);

	return {
		totalPlays,
		totalMsPlayed,
		firstPlayed,
		lastPlayed,
		daysSinceLastPlayed,
	};
}

async function _enrichWithSpotifyData(
	candidates: Partial<ForgottenGem>[],
	userId: string,
): Promise<ForgottenGem[]> {
	if (candidates.length === 0) return [];

	spotify.setUserId(userId);
	const trackIds = candidates.map((c) => c.spotifyId!);
	const spotifyTracks = await spotify.tracks.list(trackIds);

	return candidates
		.map((candidate) => {
			const spotifyTrack = spotifyTracks.find(
				(t) => t.id === candidate.spotifyId,
			);
			if (!spotifyTrack) return null;

			return {
				...candidate,
				name: spotifyTrack.name,
				artists: spotifyTrack.artists.map((a) => a.name),
				albumName: spotifyTrack.album.name,
				image: spotifyTrack.album.images[0]?.url || "",
				spotifyUrl: spotifyTrack.external_urls.spotify,
				durationMs: spotifyTrack.duration_ms,
			} as ForgottenGem;
		})
		.filter(Boolean) as ForgottenGem[];
}
