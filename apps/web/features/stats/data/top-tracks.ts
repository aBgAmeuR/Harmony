"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { db } from "@repo/database";
import { spotify } from "@repo/spotify";

import { getMsPlayedInMinutes } from "~/lib/utils";

import { getRankChange, getTimeRangeStats } from "./utils";

export const getTopTracks = async (userId: string, isDemo: boolean) => {
	"use cache";
	cacheLife("hours");
	cacheTag(`top-tracks-${userId}`);

	const timeRange = await getTimeRangeStats(userId, isDemo);
	spotify.setUserId(userId);

	type PreviousRanking = { trackId: string; rank: number };
	type Track = {
		id: string;
		album: { images: { url: string }[] };
		name: string;
		external_urls: { spotify: string };
		artists: { name: string }[];
		popularity: number;
		duration_ms: number;
	};

	const [previousRankings, tracks] = await Promise.all([
		db.query.historicalTrackRankings.findMany({
			where: (table, { and, eq }) =>
				and(eq(table.userId, userId), eq(table.timeRange, timeRange)),
			orderBy: (table, { desc }) => [desc(table.timestamp)],
			columns: { trackId: true, rank: true },
			limit: 50,
		}) as Promise<PreviousRanking[]>,
		spotify.me.top("tracks", timeRange) as Promise<Track[]>,
	]);

	return tracks.map((track: Track, index: number) => {
		const previous = previousRankings.find(
			(r: PreviousRanking) => r.trackId === track.id,
		);
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
