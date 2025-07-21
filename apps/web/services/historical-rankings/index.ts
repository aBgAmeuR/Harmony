"use server";

import { getUser } from "@repo/auth";
import {
	and,
	db,
	eq,
	historicalArtistRankings,
	historicalTrackRankings,
} from "@repo/database";
import { SpotifyAPI } from "@repo/spotify";

import { getTimeRangeStats } from "~/features/stats/data/utils";

export async function getHistoricalTrackRankings(trackId: string) {
	const { userId, isDemo } = await getUser();
	if (!userId) return [];

	const timeRangeStats = await getTimeRangeStats(userId, isDemo);
	if (!timeRangeStats) return [];

	const distinctTimestamps = db
		.selectDistinct({ timestamp: historicalTrackRankings.timestamp })
		.from(historicalTrackRankings)
		.where(
			and(
				eq(historicalTrackRankings.userId, userId),
				eq(historicalTrackRankings.timeRange, timeRangeStats),
			),
		)
		.as("distinct_timestamps");

	const results = await db
		.select({
			timestamp: distinctTimestamps.timestamp,
			rank: historicalTrackRankings.rank,
		})
		.from(distinctTimestamps)
		.leftJoin(
			historicalTrackRankings,
			and(
				eq(historicalTrackRankings.timestamp, distinctTimestamps.timestamp),
				eq(historicalTrackRankings.userId, userId),
				eq(historicalTrackRankings.trackId, trackId),
				eq(historicalTrackRankings.timeRange, timeRangeStats),
			),
		)
		.orderBy(distinctTimestamps.timestamp);

	return results.map((row) => ({
		timestamp: row.timestamp ? new Date(row.timestamp) : new Date(),
		rank: row.rank ?? null,
	}));
}

export async function getHistoricalArtistRankings(artistId: string) {
	const { userId, isDemo } = await getUser();
	if (!userId) return [];

	const timeRangeStats = await getTimeRangeStats(userId, isDemo);
	if (!timeRangeStats) return [];

	const distinctTimestamps = db
		.selectDistinct({ timestamp: historicalArtistRankings.timestamp })
		.from(historicalArtistRankings)
		.where(
			and(
				eq(historicalArtistRankings.userId, userId),
				eq(historicalArtistRankings.timeRange, timeRangeStats),
			),
		)
		.as("distinct_timestamps");

	const results = await db
		.select({
			timestamp: distinctTimestamps.timestamp,
			rank: historicalArtistRankings.rank,
		})
		.from(distinctTimestamps)
		.leftJoin(
			historicalArtistRankings,
			and(
				eq(historicalArtistRankings.timestamp, distinctTimestamps.timestamp),
				eq(historicalArtistRankings.userId, userId),
				eq(historicalArtistRankings.artistId, artistId),
				eq(historicalArtistRankings.timeRange, timeRangeStats),
			),
		)
		.orderBy(distinctTimestamps.timestamp);

	return results.map((row) => ({
		timestamp: row.timestamp ? new Date(row.timestamp) : new Date(),
		rank: row.rank ?? null,
	}));
}

export async function updateHistoricalRankings(userId: string) {
	try {
		const timeRanges = ["short_term", "medium_term", "long_term"] as const;
		const allTrackRankings = [];
		const allArtistRankings = [];

		const spotify = new SpotifyAPI({
			clientId: process.env.AUTH_SPOTIFY_ID || "missing",
			clientSecret: process.env.AUTH_SPOTIFY_SECRET || "missing",
			debug: true,
			userId,
		});

		for (const timeRange of timeRanges) {
			const topTracks = await spotify.me.top("tracks", timeRange);
			const topArtists = await spotify.me.top("artists", timeRange);

			const trackRankings = topTracks.map((track, index) => ({
				userId,
				trackId: track.id,
				rank: index + 1,
				timeRange,
			}));

			const artistRankings = topArtists.map((artist, index) => ({
				userId,
				artistId: artist.id,
				rank: index + 1,
				timeRange,
			}));

			allTrackRankings.push(...trackRankings);
			allArtistRankings.push(...artistRankings);
		}

		await Promise.all([
			db.insert(historicalTrackRankings).values(allTrackRankings),
			db.insert(historicalArtistRankings).values(allArtistRankings),
		]);
	} catch (error) {
		console.error(error);
	}
}
