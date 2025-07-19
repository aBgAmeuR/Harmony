"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { auth, count, db, tracks } from "@repo/database";

import { getMonthRange } from "~/lib/dal";

export const getShuffleHabitsData = async (userId: string, isDemo: boolean) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "shuffle-habits");

	const monthRange = await getMonthRange(userId, isDemo);

	const shuffles = await db
		.select({
			shuffle: tracks.shuffle,
			count: count(),
		})
		.from(tracks)
		.where(auth(userId, { monthRange }))
		.groupBy(tracks.shuffle);

	return {
		shuffled: shuffles.find((shuffle) => shuffle.shuffle === true)?.count || 0,
		notShuffled:
			shuffles.find((shuffle) => shuffle.shuffle === false)?.count || 1,
	};
};
