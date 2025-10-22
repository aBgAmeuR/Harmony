"server-only";

import { cacheLife, cacheTag } from "next/cache";

import { db, eq, users } from "@repo/database";

import type { TimeRange } from "../types/time-range";

export const getTimeRangeData = async (
	userId: string,
	isDemo: boolean,
): Promise<TimeRange> => {
	"use cache";
	cacheLife("hours");
	cacheTag(`time-range-${userId}`);

	if (isDemo) return "medium_term";

	const timeRange = await db.query.users.findFirst({
		where: eq(users.id, userId),
		columns: { timeRangeStats: true },
	});

	return timeRange?.timeRangeStats || "medium_term";
};
