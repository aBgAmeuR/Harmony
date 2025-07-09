"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { prisma } from "@repo/database";
import { spotify } from "@repo/spotify";

import { getMonthRange } from "~/lib/dal";
import { getMsPlayedInMinutes } from "~/lib/utils";

export const getRankingArtistsData = async (
	userId: string,
	isDemo: boolean,
	limit = 50,
) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "ranking-artists");

	const monthRange = await getMonthRange(userId, isDemo);

	const topArtists = await prisma.track.groupBy({
		by: ["artistIds"],
		_count: { _all: true },
		_sum: { msPlayed: true },
		where: {
			userId,
			timestamp: { gte: monthRange.dateStart, lt: monthRange.dateEnd },
		},
		orderBy: { _sum: { msPlayed: "desc" } },
	});

	const aggregatedArtists: Record<
		string,
		{ totalMsPlayed: bigint; trackCount: number }
	> = {};

	topArtists.forEach((entry) => {
		entry.artistIds.forEach((artistId) => {
			if (!aggregatedArtists[artistId]) {
				aggregatedArtists[artistId] = {
					totalMsPlayed: BigInt(0),
					trackCount: 0,
				};
			}

			aggregatedArtists[artistId].totalMsPlayed +=
				entry._sum.msPlayed || BigInt(0);
			aggregatedArtists[artistId].trackCount += entry._count._all;
		});
	});

	const sortedArtists = Object.entries(aggregatedArtists)
		.map(([artistId, stats]) => ({
			artistId,
			totalMsPlayed: stats.totalMsPlayed,
			trackCount: stats.trackCount,
		}))
		.sort((a, b) => Number(b.totalMsPlayed - a.totalMsPlayed))
		.slice(0, limit);

	spotify.setUserId(userId);
	const artistsInfos = await spotify.artists.list(
		sortedArtists.map((artist) => artist.artistId),
	);

	return artistsInfos.map((artist) => {
		const topartist = sortedArtists.find(
			(topArtist) => topArtist.artistId === artist.id,
		);
		const msPlayed = Number(topartist?.totalMsPlayed) || 0;
		return {
			id: artist.id,
			href: artist.external_urls.spotify,
			image: artist.images[0]?.url,
			name: artist.name,
			stat1: `${getMsPlayedInMinutes(msPlayed)} minutes`,
			stat2: `${topartist?.trackCount || 0} streams`,
		};
	});
};
