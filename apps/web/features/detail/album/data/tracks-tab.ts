"server-only";

import { prisma } from "@repo/database";
import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";
import { getAlbumDetails } from "./utils";

export const getTracksTabData = async (albumId: string, userId: string) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "album-detail", "tracks-tab");

	const album = await getAlbumDetails(albumId, userId);
	if (!album) return [];

	const tracks = album.tracks.items;
	const stats = await prisma.track.groupBy({
		by: ["spotifyId"],
		where: { userId, albumId },
		_sum: { msPlayed: true },
		_count: { _all: true },
	});

	return tracks.map((track) => {
		const stat = stats.find((s) => s.spotifyId === track.id);
		return {
			index: track.track_number,
			id: track.id,
			name: track.name,
			artists: track.artists.map((a) => a.name).join(", "),
			image: album.images[0]?.url,
			msPlayed: stat ? Number(stat._sum.msPlayed) : 0,
			plays: stat ? stat._count._all : 0,
			spotifyUrl: track.external_urls.spotify,
		};
	});
};
