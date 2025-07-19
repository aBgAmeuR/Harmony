"server-only";

import { cache } from "react";

import { db, eq, users } from "@repo/database";

export const getTimeRangeStats = cache(
	async (userId: string, isDemo: boolean) => {
		if (isDemo) return "medium_term";

		const timeRangeStats = await db.query.users.findFirst({
			where: eq(users.id, userId),
			columns: { timeRangeStats: true },
		});

		if (!timeRangeStats || !timeRangeStats.timeRangeStats)
			throw new Error("Time range stats not found");

		return timeRangeStats.timeRangeStats;
	},
);

export const getRankChange = (
	previousRank: number | undefined,
	currentRank: number,
): "up" | "down" | "new" | undefined => {
	if (previousRank === undefined) return "new";
	if (previousRank > currentRank) return "up";
	if (previousRank < currentRank) return "down";
	return undefined;
};
