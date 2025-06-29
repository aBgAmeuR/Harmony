"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { prisma } from "@repo/database";
import { spotify } from "@repo/spotify";

import { getMsPlayedInMinutes } from "~/lib/utils";

import { getRankChange, getTimeRangeStats } from "./utils";

export const getTopTracks = async (userId: string, isDemo: boolean) => {
	"use cache";
	cacheLife("hours");
	cacheTag(`top-tracks-${userId}`);

	const timeRange = await getTimeRangeStats(userId, isDemo);
	spotify.setUserId(userId);

	const [previousRankings, tracks] = await Promise.all([
		prisma.historicalTrackRanking.findMany({
			where: { userId, timeRange },
			orderBy: { timestamp: "desc" },
			select: { trackId: true, rank: true },
			take: 50,
		}),
		spotify.me.top("tracks", timeRange),
	]);

	return tracks.map((track, index) => {
		const previous = previousRankings.find((r) => r.trackId === track.id);
		const rankChange = getRankChange(previous?.rank, index + 1);
		return {
			id: track.id,
			image: track.album.images[0].url,
			name: track.name,
			href: track.external_urls.spotify,
			artists: track.artists.map((artist) => artist.name).join(", "),
			stat1: `${track.popularity}% popularity`,
			stat2: `${getMsPlayedInMinutes(track.duration_ms)} minutes`,
			rankChange,
		};
	});
};
