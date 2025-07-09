"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { auth, count, db, desc, sum, tracks } from "@repo/database";
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

	const topArtists = await db
		.select({
			artistIds: tracks.artistIds,
			count: count(),
			sum: sum(tracks.msPlayed),
		})
		.from(tracks)
		.groupBy(tracks.artistIds)
		.where(auth(userId, { monthRange }))
		.orderBy(({ sum }) => desc(sum))
		.limit(limit);

	const aggregatedArtists: Record<
		string,
		{ totalMsPlayed: number; trackCount: number }
	> = {};

	topArtists.forEach((entry) => {
		entry.artistIds.forEach((artistId) => {
			if (!aggregatedArtists[artistId]) {
				aggregatedArtists[artistId] = {
					totalMsPlayed: 0,
					trackCount: 0,
				};
			}

			aggregatedArtists[artistId].totalMsPlayed += Number(entry.sum) || 0;
			aggregatedArtists[artistId].trackCount += entry.count;
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
