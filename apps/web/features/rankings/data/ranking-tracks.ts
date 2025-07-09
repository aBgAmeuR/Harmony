"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { prisma } from "@repo/database";
import { spotify } from "@repo/spotify";

import { getMonthRange } from "~/lib/dal";
import { getMsPlayedInMinutes } from "~/lib/utils";

export const getRankingTracksData = async (
	userId: string,
	isDemo: boolean,
	limit = 50,
) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "ranking-tracks");

	const monthRange = await getMonthRange(userId, isDemo);

	const topTracks = await prisma.track.groupBy({
		by: ["spotifyId"],
		_count: { _all: true },
		_sum: { msPlayed: true },
		where: {
			userId,
			timestamp: { gte: monthRange.dateStart, lt: monthRange.dateEnd },
		},
		orderBy: { _sum: { msPlayed: "desc" } },
		take: limit,
	});

	spotify.setUserId(userId);
	const tracksInfos = await spotify.tracks.list(
		topTracks.map((track) => track.spotifyId),
	);

	return tracksInfos.map((track) => {
		const topTrack = topTracks.find(
			(topTrack) => topTrack.spotifyId === track.id,
		);
		const msPlayed = Number(topTrack?._sum.msPlayed) || 0;
		return {
			id: track.id,
			href: track.external_urls.spotify,
			image: track.album.images[0].url,
			name: track.name,
			artists: track.artists.map((artist) => artist.name).join(", "),
			stat1: `${getMsPlayedInMinutes(msPlayed)} minutes`,
			stat2: `${topTrack?._count?._all || 0} streams`,
		};
	});
};
