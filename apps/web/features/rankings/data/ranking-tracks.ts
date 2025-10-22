"server-only";

import { cacheLife, cacheTag } from "next/cache";

import { auth, count, db, desc, sum, tracks } from "@repo/database";
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

	const topTracks = await db
		.select({
			spotifyId: tracks.spotifyId,
			count: count(),
			sum: sum(tracks.msPlayed),
		})
		.from(tracks)
		.groupBy(tracks.spotifyId)
		.where(auth(userId, { monthRange }))
		.orderBy(({ sum }) => desc(sum))
		.limit(limit);

	spotify.setUserId(userId);
	const tracksInfos = await spotify.tracks.list(
		topTracks.map((track) => track.spotifyId),
	);

	return tracksInfos.map((track) => {
		const topTrack = topTracks.find(
			(topTrack) => topTrack.spotifyId === track.id,
		);
		const msPlayed = Number(topTrack?.sum) || 0;
		return {
			id: track.id,
			href: track.external_urls.spotify,
			image: track.album.images[0].url,
			name: track.name,
			artists: track.artists.map((artist) => artist.name).join(", "),
			stat1: `${getMsPlayedInMinutes(msPlayed)} minutes`,
			stat2: `${topTrack?.count || 0} streams`,
		};
	});
};
