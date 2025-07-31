"server-only";

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
import { DateUtils } from "~/lib/date-utils";

function fillHistoricalTimeline(
	data: Array<{ timestamp: Date; rank: number | null }>,
) {
	if (data.length === 0) return [];

	const sortedData = [...data].sort(
		(a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
	);

	const minDate = sortedData[0].timestamp;
	const maxDate = sortedData[sortedData.length - 1].timestamp;

	const dataMap = new Map(
		sortedData.map((item) => [item.timestamp.getTime(), item.rank]),
	);

	const filledData = [];

	const currentDate = new Date(minDate);
	while (currentDate <= maxDate) {
		const timestamp = new Date(currentDate);
		const rank = dataMap.get(timestamp.getTime()) ?? null;

		filledData.push({
			timestamp: DateUtils.formatDate(timestamp, "full"),
			rank,
		});

		currentDate.setDate(currentDate.getDate() + 7);
	}

	return filledData;
}

export async function getHistoricalTrackRankings(
	userId: string,
	isDemo: boolean,
	trackId: string,
) {
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

	const mappedResults = results.map((row) => ({
		timestamp: row.timestamp ? new Date(row.timestamp) : new Date(),
		rank: row.rank ?? null,
	}));

	return fillHistoricalTimeline(mappedResults);
}

export async function getHistoricalArtistRankings(
	userId: string,
	isDemo: boolean,
	artistId: string,
) {
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

	const mappedResults = results.map((row) => ({
		timestamp: row.timestamp ? new Date(row.timestamp) : new Date(),
		rank: row.rank ?? null,
	}));

	return fillHistoricalTimeline(mappedResults);
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
