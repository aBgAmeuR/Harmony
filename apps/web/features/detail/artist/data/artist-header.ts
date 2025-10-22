"server-only";

import { cacheLife, cacheTag } from "next/cache";

import {
	and,
	arrayOverlaps,
	auth,
	count,
	db,
	sql,
	tracks,
} from "@repo/database";

import { getArtistDetails } from "./utis";

export const getArtistHeaderData = async (artistId: string, userId: string) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "artist-detail", "artist-header");

	const [artist, [{ totalMinutes = 0, totalStreams = 0 }]] = await Promise.all([
		getArtistDetails(artistId, userId),
		db
			.select({
				totalMinutes: sql<number>`ROUND(SUM("msPlayed")::numeric / 1000 / 60)`,
				totalStreams: count(),
			})
			.from(tracks)
			.where(and(auth(userId), arrayOverlaps(tracks.artistIds, [artistId]))),
	]);

	return {
		artist,
		totalMinutes: Number(totalMinutes),
		totalStreams: Number(totalStreams),
	};
};
