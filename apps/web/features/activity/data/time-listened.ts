"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { prisma } from "@repo/database";

import { getMonthRange } from "~/lib/dal";
import { formatMonth } from "~/lib/utils";

export const getTimeListenedData = async (userId: string, isDemo: boolean) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "time-listened");

	const monthRange = await getMonthRange(userId, isDemo);

	const tracks = await prisma.$queryRaw<
		{ month: string; totalmsplayed: number }[]
	>`
    SELECT TO_CHAR(timestamp, 'YYYY-MM') as month, SUM("msPlayed") as totalmsplayed
    FROM "Track"
    WHERE "userId" = ${userId} 
      AND "timestamp" >= ${monthRange.dateStart} 
      AND "timestamp" < ${monthRange.dateEnd}
    GROUP BY month
    ORDER BY month ASC
  `;

	const data: Record<string, number> = {};
	let totalMsPlayed = 0;

	tracks.forEach((track) => {
		const date = new Date(track.month);
		const key = formatMonth(date);
		data[key] = Number(track.totalmsplayed);
		totalMsPlayed += Number(track.totalmsplayed);
	});

	const average = totalMsPlayed / tracks.length;

	return {
		data: Object.entries(data).map(([key, value]) => ({
			month: key,
			value: Number(value),
		})),
		average: Number(Math.round(average)) || 0,
	};
};
