"server-only";

import { prisma } from "@repo/database";
import { cache } from "react";

export const getTimeRangeStats = cache(
	async (userId: string, isDemo: boolean) => {
		if (isDemo) return "medium_term";

		const timeRangeStats = await prisma.user.findFirst({
			where: { id: userId },
			select: { timeRangeStats: true },
		});

		if (!timeRangeStats) throw new Error("Time range stats not found");

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
