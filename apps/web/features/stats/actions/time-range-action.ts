"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { db, eq, users } from "@repo/database";

import { getUserInfos } from "~/lib/utils";

import type { TimeRange } from "../types/time-range";

export const setTimeRangeAction = async (timeRange: TimeRange) => {
	const { userId, isDemo } = await getUserInfos();

	if (!userId || isDemo) return null;

	if (!["short_term", "medium_term", "long_term"].includes(timeRange))
		return null;

	await db
		.update(users)
		.set({ timeRangeStats: timeRange })
		.where(eq(users.id, userId));

	revalidateTag(`time-range-${userId}`);
	revalidateTag(`top-artists-${userId}`);
	revalidateTag(`top-tracks-${userId}`);
	revalidatePath("/top");
};
