"use server";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { and, auth, count, db, gte, lte, sql, tracks } from "@repo/database";

import type { ForgottenGem } from "../types";

type TrackYearStats = {
	spotifyId: string;
	year: number;
	playCount: number;
	totalTime: bigint;
};

export const getForgottenGems = async (
	userId: string,
): Promise<ForgottenGem[]> => {
	// "use cache";
	// cacheLife("days");
	// cacheTag(userId, "forgotten-gems");

	const _trackYearStats = await getTrackYearStats(userId);

	return [];
};

async function getTrackYearStats(userId: string): Promise<TrackYearStats[]> {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "forgotten-gems-all-years");

	const results = await db
		.select({
			spotifyId: tracks.spotifyId,
			year: sql<number>`EXTRACT(YEAR FROM ${tracks.timestamp})`,
			playCount: count(),
			totalTime: sql<bigint>`SUM(${tracks.msPlayed})`,
		})
		.from(tracks)
		.where(auth(userId))
		.groupBy(({ year }) => [tracks.spotifyId, year])
		.having(({ playCount }) => and(gte(playCount, 10), lte(playCount, 100)));

	return results.map((result) => ({
		spotifyId: result.spotifyId,
		year: Number(result.year),
		playCount: result.playCount,
		totalTime: result.totalTime,
	}));
}
