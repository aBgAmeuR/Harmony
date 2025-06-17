"server-only";

import { prisma } from "@repo/database";
import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";
import { getArtistDetails } from "./utis";

export const getArtistHeaderData = async (artistId: string, userId: string) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "artist-detail", "artist-header");

	const [artist, [{ totalMinutes = 0, totalStreams = 0 }]] = await Promise.all([
		getArtistDetails(artistId, userId),
		prisma.$queryRaw<{ totalMinutes: number; totalStreams: number }[]>`
            SELECT
            ROUND(SUM("msPlayed")::numeric / 1000 / 60) AS "totalMinutes",
            COUNT(*) AS "totalStreams"
            FROM "Track"
            WHERE "userId" = ${userId}
            AND ${artistId} = ANY("artistIds")
      `,
	]);

	return {
		artist,
		totalMinutes: Number(totalMinutes),
		totalStreams: Number(totalStreams),
	};
};
