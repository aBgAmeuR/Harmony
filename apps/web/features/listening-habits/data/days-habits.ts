"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { auth, db, sql, sum, tracks } from "@repo/database";

import { getMonthRange } from "~/lib/dal";

export const getDaysHabitsData = async (userId: string, isDemo: boolean) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "days-habits");

	const monthRange = await getMonthRange(userId, isDemo);

	const data = await db
		.select({
			day: sql<bigint>`EXTRACT(DOW FROM timestamp)`,
			time: sum(tracks.msPlayed),
		})
		.from(tracks)
		.where(auth(userId, { monthRange }))
		.groupBy(({ day }) => day);

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
