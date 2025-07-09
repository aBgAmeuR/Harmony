"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { prisma } from "@repo/database";

import { formatMonth } from "~/lib/utils";

export const getStatsTabData = async (artistId: string, userId: string) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "artist-detail", "stats-tab");

	const listeningHabits = Array.from({ length: 24 }, (_, i) => ({
		hour: i,
		msPlayed: 0,
	}));

	const [hourData, monthData] = await Promise.all([
		prisma.$queryRaw<{ hour: bigint; msplayed: bigint }[]>`
            SELECT
                EXTRACT(HOUR FROM timestamp) AS hour,
                SUM("msPlayed") AS msplayed
            FROM "Track"
            WHERE "userId" = ${userId} AND ${artistId} = ANY("artistIds")
            GROUP BY hour
            ORDER BY hour ASC
    `,
		prisma.$queryRaw<{ month: string; totalmsplayed: number }[]>`
            SELECT TO_CHAR(timestamp, 'YYYY-MM') as month, SUM("msPlayed") as totalmsplayed
            FROM "Track"
            WHERE "userId" = ${userId} AND ${artistId} = ANY("artistIds")
            GROUP BY month
            ORDER BY month ASC
    `,
	]);

	const monthDataClean: Record<string, number> = {};

	monthData.forEach((track) => {
		const date = new Date(track.month);
		const key = formatMonth(date);
		monthDataClean[key] = Number(track.totalmsplayed);
	});

	const monthlyTrends = Object.entries(monthDataClean).map(([key, value]) => ({
		month: key,
		msPlayed: Number(value),
	}));

	const timeDistribution = listeningHabits.map((habit) => {
		const dataItem = hourData.find((d) => Number(d.hour) === habit.hour);

		return {
			hour: String(habit.hour),
			msPlayed: dataItem ? Number(dataItem.msplayed) : 0,
		};
	});

	return {
		monthlyTrends,
		timeDistribution,
	};
};
