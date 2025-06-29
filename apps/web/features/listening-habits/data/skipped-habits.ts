"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { prisma } from "@repo/database";

import { getMonthRange } from "~/lib/dal";

export const getSkippedHabitsData = async (userId: string, isDemo: boolean) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "skipped-habits");

	const monthRange = await getMonthRange(userId, isDemo);

	const skippeds = await prisma.track.groupBy({
		by: ["skipped"],
		_count: { _all: true },
		where: {
			userId,
			timestamp: { gte: monthRange.dateStart, lt: monthRange.dateEnd },
		},
	});

	return {
		skipped:
			skippeds.find((shuffle) => shuffle.skipped === true)?._count?._all || 0,
		notSkipped:
			skippeds.find((shuffle) => shuffle.skipped === false)?._count?._all || 1,
	};
};
