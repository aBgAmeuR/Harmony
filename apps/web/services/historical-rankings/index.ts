"use server";

import { prisma } from "@repo/database";
import { SpotifyAPI } from "@repo/spotify";

import { getTimeRangeStats } from "~/features/stats/data/utils";
import { getUserInfos } from "~/lib/utils";

export async function getHistoricalTrackRankings(trackId: string) {
	const { userId, isDemo } = await getUserInfos();
	if (!userId) return [];

	const timeRangeStats = await getTimeRangeStats(userId, isDemo);
	if (!timeRangeStats) return [];

	const res = await prisma.historicalTrackRanking.findMany({
		where: {
			userId,
			trackId,
			timeRange: timeRangeStats,
		},
		orderBy: { timestamp: "asc" },
	});

	return res;
}

export async function getHistoricalArtistRankings(artistId: string) {
	const { userId, isDemo } = await getUserInfos();
	if (!userId) return [];

	const timeRangeStats = await getTimeRangeStats(userId, isDemo);
	if (!timeRangeStats) return [];

	const results = await prisma.$queryRaw`
		SELECT d.timestamp, r.rank
		FROM (
			SELECT DISTINCT timestamp
			FROM "HistoricalArtistRanking"
			WHERE "userId" = ${userId} AND "timeRange" = ${timeRangeStats}::"TimeRangeStats"
		) d
		LEFT JOIN "HistoricalArtistRanking" r
		ON r."timestamp" = d.timestamp
		AND r."userId" = ${userId}
		AND r."artistId" = ${artistId}
		AND r."timeRange" = ${timeRangeStats}::"TimeRangeStats"
		ORDER BY d.timestamp ASC;
	`;

	return (results as Array<{ timestamp: string; rank: number | null }>).map(
		(row) => ({
			rank: row.rank,
			timestamp: new Date(row.timestamp),
		}),
	);
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

		await prisma.$transaction([
			prisma.historicalTrackRanking.createMany({
				data: allTrackRankings,
			}),
			prisma.historicalArtistRanking.createMany({
				data: allArtistRankings,
			}),
		]);
	} catch (error) {
		console.error(error);
	}
}
