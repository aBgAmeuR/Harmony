"server-only";

import { prisma } from "@repo/database";
import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";
import { getMonthRange } from "~/lib/dal";

export const getDaysHabitsData = async (userId: string, isDemo: boolean) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "days-habits");

	const monthRange = await getMonthRange(userId, isDemo);

	const data: { day: bigint; time: bigint }[] = await prisma.$queryRaw`
    SELECT
      EXTRACT(DOW FROM timestamp) AS day,
      SUM("msPlayed") AS time
    FROM "Track"
    WHERE "userId" = ${userId}
      AND timestamp BETWEEN ${monthRange.dateStart} AND ${monthRange.dateEnd}
    GROUP BY day
  `;

	const daysOfWeek = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	return daysOfWeek.map((day, index) => {
		const dataItem = data.find((d) => Number(d.day) === index);
		return {
			day,
			msPlayed: dataItem ? Number(dataItem.time) : 0,
		};
	});
};
