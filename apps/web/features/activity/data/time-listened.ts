"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { auth, db, sql, sum, tracks } from "@repo/database";

import { getMonthRange } from "~/lib/dal";
import { formatMonth } from "~/lib/utils";

export const getTimeListenedData = async (userId: string, isDemo: boolean) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "time-listened");

	const monthRange = await getMonthRange(userId, isDemo);

	const tracksData = await db
		.select({
			month: sql<string>`TO_CHAR(timestamp, 'YYYY-MM')`,
			totalmsplayed: sum(tracks.msPlayed),
		})
		.from(tracks)
		.where(auth(userId, { monthRange }))
		.groupBy(({ month }) => month)
		.orderBy(({ month }) => month);

	const data: Record<string, number> = {};
	let totalMsPlayed = 0;

	tracksData.forEach((track) => {
		const date = new Date(track.month);
		const key = formatMonth(date);
		data[key] = Number(track.totalmsplayed);
		totalMsPlayed += Number(track.totalmsplayed);
	});

	const average = totalMsPlayed / tracksData.length;

	return {
		data: Object.entries(data).map(([key, value]) => ({
			month: key,
			value: Number(value),
		})),
		average: Number(Math.round(average)) || 0,
	};
};
