"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { and, auth, count, db, eq, sum, tracks } from "@repo/database";

import { getAlbumDetails } from "./utils";

export const getTracksTabData = async (albumId: string, userId: string) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "album-detail", "tracks-tab");

	const album = await getAlbumDetails(albumId, userId);
	if (!album) return [];

	const stats = await db
		.select({
			spotifyId: tracks.spotifyId,
			msPlayed: sum(tracks.msPlayed),
			count: count(),
		})
		.from(tracks)
		.where(and(auth(userId), eq(tracks.albumId, albumId)))
		.groupBy(tracks.spotifyId);

	return album.tracks.items.map((track) => {
		const stat = stats.find((s) => s.spotifyId === track.id);
		return {
			index: track.track_number,
			id: track.id,
			name: track.name,
			artists: track.artists.map((a) => a.name).join(", "),
			image: album.images[0]?.url,
			msPlayed: stat ? Number(stat.msPlayed ?? 0) : 0,
			plays: stat ? stat.count : 0,
			spotifyUrl: track.external_urls.spotify,
		};
	});
};
