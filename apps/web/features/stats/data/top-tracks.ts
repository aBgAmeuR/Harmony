"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { and, db, desc, eq, historicalTrackRankings } from "@repo/database";
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
		db
			.select({
				trackId: historicalTrackRankings.trackId,
				rank: historicalTrackRankings.rank,
			})
			.from(historicalTrackRankings)
			.where(
				and(
					eq(historicalTrackRankings.userId, userId),
					eq(historicalTrackRankings.timeRange, timeRange),
				),
			)
			.orderBy(desc(historicalTrackRankings.timestamp))
			.limit(50),
		spotify.me.top("tracks", timeRange),
	]);

	return tracks.map((track, index: number) => {
		const previous = previousRankings.find((r) => r.trackId === track.id);
		const rankChange = getRankChange(previous?.rank, index + 1);
		return {
			id: track.id,
			image: track.album.images[0].url,
			name: track.name,
			href: track.external_urls.spotify,
			artists: track.artists
				.map((artist: { name: string }) => artist.name)
				.join(", "),
			stat1: `${track.popularity}% popularity`,
			stat2: `${getMsPlayedInMinutes(track.duration_ms)} minutes`,
			rankChange,
		};
	});
};
