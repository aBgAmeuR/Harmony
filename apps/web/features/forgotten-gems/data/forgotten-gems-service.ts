"use server";

import { prisma } from "@repo/database";
import { spotify } from "@repo/spotify";

import type {
	ForgottenGem,
	ForgottenGemsConfig,
	TrackPlayData,
	YearOption,
} from "../types";

const DEFAULT_CONFIG: ForgottenGemsConfig = {
	minDaysSinceLastPlayed: 365 * 0,
	maxDaysSinceLastPlayed: 365 * 10,
	lookbackPeriodDays: 365 * 99,
	minTotalPlays: 3,
	minCompletionRate: 0.7,
	minAffinityScore: 100000, // ~1.6 minutes total listening
	maxResults: 50,
};

/**
 * Get available years for a user's listening history
 */
export const getAvailableYears = async (
	userId: string,
): Promise<YearOption[]> => {
	const yearStats = await prisma.$queryRaw<
		{ year: number; track_count: number }[]
	>`
		SELECT 
			EXTRACT(YEAR FROM timestamp) as year,
			COUNT(*) as track_count
		FROM "Track"
		WHERE "userId" = ${userId}
		GROUP BY year
		ORDER BY year DESC
	`;

	return yearStats.map((stat) => ({
		year: Number(stat.year),
		trackCount: Number(stat.track_count),
		label: `${stat.year} (${Number(stat.track_count).toLocaleString()} tracks)`,
	}));
};

/**
 * Main service to discover forgotten gems for a user
 */
export const getForgottenGems = async (
	userId: string,
	config: Partial<ForgottenGemsConfig> = {},
) => {
	// "use cache";
	// cacheLife("hours");
	// cacheTag(userId, "forgotten-gems");

	const finalConfig = { ...DEFAULT_CONFIG, ...config };
	const now = new Date();

	// Calculate date range based on year selection
	const dateRange = calculateDateRange(finalConfig, now);

	// Get all track plays within the calculated date range
	const trackPlays = await getTrackPlaysData(
		userId,
		dateRange.start,
		dateRange.end,
	);

	// Analyze patterns and identify candidates
	const candidates = analyzeTrackPatterns(trackPlays, finalConfig, now);

	// Filter based on quality thresholds
	// const filteredCandidates = filterCandidates(candidates, finalConfig);

	// Get Spotify metadata for top candidates
	const topCandidates = candidates
		.sort((a, b) => (b.affinityScore || 0) - (a.affinityScore || 0))
		.slice(0, finalConfig.maxResults);

	return await enrichWithSpotifyData(topCandidates, userId);
};

/**
 * Calculate date range based on year selection
 */
function calculateDateRange(config: ForgottenGemsConfig, now: Date) {
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
		startDate.setDate(startDate.getDate() - config.lookbackPeriodDays);
		endDate = now;
	}

	return { start: startDate, end: endDate };
}

/**
 * Calculate tracks per year for analytics
 */
function _calculateTracksPerYear(
	trackPlays: TrackPlayData[],
): Record<string, number> {
	return trackPlays.reduce(
		(acc, play) => {
			const year = play.timestamp.getFullYear().toString();
			acc[year] = (acc[year] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);
}

/**
 * Fetch all track play data for analysis
 */
async function getTrackPlaysData(
	userId: string,
	startDate: Date,
	endDate: Date,
): Promise<TrackPlayData[]> {
	const tracks = await prisma.track.findMany({
		where: {
			userId,
			timestamp: { gte: startDate, lte: endDate },
		},
		select: {
			spotifyId: true,
			timestamp: true,
			msPlayed: true,
			skipped: true,
			reasonEnd: true,
		},
		orderBy: { timestamp: "asc" },
	});

	return tracks.map((track) => ({
		spotifyId: track.spotifyId,
		timestamp: track.timestamp,
		msPlayed: Number(track.msPlayed),
		skipped: track.skipped,
		reasonEnd: track.reasonEnd,
	}));
}

/**
 * Analyze listening patterns to identify forgotten gem candidates
 */
function analyzeTrackPatterns(
	trackPlays: TrackPlayData[],
	config: ForgottenGemsConfig,
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

		// Check if track qualifies as "forgotten"
		if (
			analysis.daysSinceLastPlayed >= config.minDaysSinceLastPlayed &&
			analysis.daysSinceLastPlayed <= config.maxDaysSinceLastPlayed
		) {
			candidates.push({
				spotifyId,
				...analysis,
			});
		}
	}

	return candidates;
}

/**
 * Analyze individual track plays to calculate metrics
 */
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
	const averagePlayDuration = totalMsPlayed / totalPlays;

	// Calculate completion rate (non-skipped vs skipped)
	const completedPlays = plays.filter(
		(play) => !play.skipped && play.reasonEnd !== "trackdone",
	).length;
	const completionRate = completedPlays / totalPlays;

	// Calculate affinity score (combination of plays, duration, and completion)
	const affinityScore =
		totalMsPlayed * completionRate * Math.log(totalPlays + 1);

	// Find peak listening period
	const peakPeriod = findPeakListeningPeriod(sortedPlays);

	// Determine recommendation reason
	const { reason, reasonScore } = determineRecommendationReason(plays, {
		completionRate,
		averagePlayDuration,
		peakPeriod,
		totalPlays,
	});

	return {
		totalPlays,
		totalMsPlayed,
		averagePlayDuration,
		completionRate,
		affinityScore,
		firstPlayed,
		lastPlayed,
		daysSinceLastPlayed,
		peakPeriod,
		reason,
		reasonScore,
	};
}

/**
 * Find the period with highest listening intensity
 */
function findPeakListeningPeriod(sortedPlays: TrackPlayData[]) {
	const windowDays = 30; // Look for 30-day peak periods
	let maxPlays = 0;
	let peakStart = sortedPlays[0].timestamp;
	let peakEnd = sortedPlays[0].timestamp;

	for (let i = 0; i < sortedPlays.length; i++) {
		const windowStart = sortedPlays[i].timestamp;
		const windowEnd = new Date(
			windowStart.getTime() + windowDays * 24 * 60 * 60 * 1000,
		);

		const playsInWindow = sortedPlays.filter(
			(play) => play.timestamp >= windowStart && play.timestamp <= windowEnd,
		).length;

		if (playsInWindow > maxPlays) {
			maxPlays = playsInWindow;
			peakStart = windowStart;
			peakEnd = windowEnd;
		}
	}

	return {
		start: peakStart,
		end: peakEnd,
		playsInPeriod: maxPlays,
	};
}

/**
 * Determine why this track is being recommended
 */
function determineRecommendationReason(
	plays: TrackPlayData[],
	metrics: {
		completionRate: number;
		averagePlayDuration: number;
		peakPeriod: { playsInPeriod: number };
		totalPlays: number;
	},
): { reason: ForgottenGem["reason"]; reasonScore: number } {
	// High completion rate songs
	if (metrics.completionRate >= 0.9) {
		return {
			reason: "high_completion",
			reasonScore: metrics.completionRate * 100,
		};
	}

	// Songs with repeat behavior (multiple plays in short periods)
	const repeatBehaviorScore = calculateRepeatBehavior(plays);
	if (repeatBehaviorScore > 0.5) {
		return {
			reason: "repeat_behavior",
			reasonScore: repeatBehaviorScore * 100,
		};
	}

	// Songs with a clear peak period
	if (metrics.peakPeriod.playsInPeriod >= 5) {
		return {
			reason: "peak_period",
			reasonScore: metrics.peakPeriod.playsInPeriod * 10,
		};
	}

	// Long listening sessions
	if (metrics.averagePlayDuration > 180000) {
		// > 3 minutes average
		return {
			reason: "long_sessions",
			reasonScore: metrics.averagePlayDuration / 1000,
		};
	}

	return {
		reason: "high_completion",
		reasonScore: metrics.completionRate * 100,
	};
}

/**
 * Calculate repeat behavior score (multiple plays within short time windows)
 */
function calculateRepeatBehavior(plays: TrackPlayData[]): number {
	const sortedPlays = plays.sort(
		(a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
	);
	let repeatInstances = 0;
	const repeatWindowMs = 24 * 60 * 60 * 1000; // 24 hours

	for (let i = 0; i < sortedPlays.length - 1; i++) {
		const currentPlay = sortedPlays[i];
		const nextPlay = sortedPlays[i + 1];

		if (
			nextPlay.timestamp.getTime() - currentPlay.timestamp.getTime() <=
			repeatWindowMs
		) {
			repeatInstances++;
		}
	}

	return repeatInstances / plays.length;
}

/**
 * Filter candidates based on quality thresholds
 */
function _filterCandidates(
	candidates: Partial<ForgottenGem>[],
	config: ForgottenGemsConfig,
): Partial<ForgottenGem>[] {
	return candidates.filter(
		(candidate) =>
			candidate.totalPlays! >= config.minTotalPlays &&
			candidate.completionRate! >= config.minCompletionRate &&
			candidate.affinityScore! >= config.minAffinityScore,
	);
}

/**
 * Enrich candidates with Spotify metadata
 */
async function enrichWithSpotifyData(
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
