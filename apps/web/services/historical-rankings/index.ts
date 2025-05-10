"use server";

import { prisma } from "@repo/database";
import { spotify } from "@repo/spotify";
import { getUserInfos } from "~/lib/utils";
import { getTimeRangeStats } from "~/services/music-lists/get-top-data";

export async function getHistoricalTrackRankings(trackId: string) {
	const { userId } = await getUserInfos();
	if (!userId) return [];

	const timeRangeStats = await getTimeRangeStats(userId);
	if (!timeRangeStats) return [];

	const res = await prisma.historicalTrackRanking.findMany({
		where: {
			userId,
			trackId,
			timeRange: timeRangeStats.timeRangeStats,
		},
		orderBy: { timestamp: "asc" },
	});

	return res;
}

export async function getHistoricalArtistRankings(artistId: string) {
	const { userId } = await getUserInfos();
	if (!userId) return [];

	const timeRangeStats = await getTimeRangeStats(userId);
	if (!timeRangeStats) return [];

	const data = await prisma.historicalArtistRanking.findMany({
		where: {
			userId,
			artistId,
			timeRange: timeRangeStats.timeRangeStats,
		},
		orderBy: { timestamp: "asc" },
	});

	return data.map((item) => ({
		rank: item.rank,
		timestamp: item.timestamp,
	}));
}

export async function updateHistoricalRankings(userId: string) {
	const timeRanges = ["short_term", "medium_term", "long_term"] as const;
	const allTrackRankings = [];
	const allArtistRankings = [];

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
}
