"server-only";

import { prisma } from "@repo/database";
import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";
import type { TimeRange } from "../types/time-range";

export const getTimeRangeData = async (
	userId: string,
	isDemo: boolean,
): Promise<TimeRange> => {
	"use cache";
	cacheLife("hours");
	cacheTag(`time-range-${userId}`);

	if (isDemo) return "medium_term";

	const timeRange = await prisma.user.findFirst({
		where: { id: userId },
		select: { timeRangeStats: true },
	});

	return timeRange?.timeRangeStats || "medium_term";
};
