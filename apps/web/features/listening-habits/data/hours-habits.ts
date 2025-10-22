"server-only";

import { cacheLife, cacheTag } from "next/cache";

import { auth, db, sql, sum, tracks } from "@repo/database";

import { getMonthRange } from "~/lib/dal";

export const getHoursHabitsData = async (userId: string, isDemo: boolean) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "hours-habits");

	const monthRange = await getMonthRange(userId, isDemo);

	const data = await db
		.select({
			hour: sql<bigint>`EXTRACT(HOUR FROM timestamp)`,
			time: sum(tracks.msPlayed),
		})
		.from(tracks)
		.where(auth(userId, { monthRange }))
		.groupBy(({ hour }) => hour)
		.orderBy(({ hour }) => hour);

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
