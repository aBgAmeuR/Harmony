"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { prisma } from "@repo/database";

import { getMonthRange } from "~/lib/dal";

export const getHoursHabitsData = async (userId: string, isDemo: boolean) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "hours-habits");

	const monthRange = await getMonthRange(userId, isDemo);

	const data: { hour: bigint; time: bigint }[] = await prisma.$queryRaw`
    SELECT
      EXTRACT(HOUR FROM timestamp) AS hour,
      SUM("msPlayed") AS time
    FROM "Track"
    WHERE "userId" = ${userId}
      AND timestamp BETWEEN ${monthRange.dateStart} AND ${monthRange.dateEnd}
    GROUP BY hour
    ORDER BY hour ASC
  `;

	const listeningHabits = Array.from({ length: 24 }, (_, i) => {
		return {
			hour: i,
			msPlayed: 0,
		};
	});

	return listeningHabits.map((habit) => {
		const dataItem = data.find((d) => Number(d.hour) === habit.hour);
		return {
			hour: String(habit.hour),
			msPlayed: dataItem ? Number(dataItem.time) : 0,
		};
	});
};
