"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { prisma } from "@repo/database";
import { spotify } from "@repo/spotify";

import { getMonthRange } from "~/lib/dal";
import { getMsPlayedInMinutes } from "~/lib/utils";

export const getRankingAlbumsData = async (
	userId: string,
	isDemo: boolean,
	limit = 50,
) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "ranking-albums");

	const monthRange = await getMonthRange(userId, isDemo);

	const topAlbums = await prisma.track.groupBy({
		by: ["albumId"],
		_count: { _all: true },
		_sum: { msPlayed: true },
		where: {
			userId,
			timestamp: { gte: monthRange.dateStart, lt: monthRange.dateEnd },
		},
		orderBy: { _sum: { msPlayed: "desc" } },
		take: limit,
	});

	const albumIds = topAlbums.map((album) => album.albumId);
	spotify.setUserId(userId);
	const albumsInfos = await spotify.albums.list(albumIds);

	return albumsInfos.map((album) => {
		const topAlbum = topAlbums.find(
			(topAlbum) => topAlbum.albumId === album.id,
		);
		const msPlayed = Number(topAlbum?._sum.msPlayed) || 0;
		return {
			id: album.id,
			href: album.external_urls.spotify,
			image: album.images[0].url,
			name: album.name || "Unknown album",
			artists: album.artists.map((artist) => artist.name).join(", "),
			stat1: `${getMsPlayedInMinutes(msPlayed)} minutes`,
			stat2: `${topAlbum?._count?._all || 0} streams`,
		};
	});
};
