"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { auth, count, db, tracks } from "@repo/database";

import { getMonthRange } from "~/lib/dal";

export const getSkippedHabitsData = async (userId: string, isDemo: boolean) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "skipped-habits");

	const monthRange = await getMonthRange(userId, isDemo);

	const skippeds = await db
		.select({
			skipped: tracks.skipped,
			count: count(),
		})
		.from(tracks)
		.where(auth(userId, { monthRange }))
		.groupBy(tracks.skipped);
		
	return {
		skipped: skippeds.find((skipped) => skipped.skipped === true)?.count || 0,
		notSkipped:
			skippeds.find((skipped) => skipped.skipped === false)?.count || 1,
	};
};
