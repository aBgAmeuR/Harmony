"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { prisma } from "@repo/database";

import { getMonthRange } from "~/lib/dal";

export const getShuffleHabitsData = async (userId: string, isDemo: boolean) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "shuffle-habits");

	const monthRange = await getMonthRange(userId, isDemo);

	const shuffles = await prisma.track.groupBy({
		by: ["shuffle"],
		_count: { _all: true },
		where: {
			userId,
			timestamp: { gte: monthRange.dateStart, lt: monthRange.dateEnd },
		},
	});

	return {
		shuffled:
			shuffles.find((shuffle) => shuffle.shuffle === true)?._count?._all || 0,
		notShuffled:
			shuffles.find((shuffle) => shuffle.shuffle === false)?._count?._all || 1,
	};
};
