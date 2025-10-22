"server-only";

import { cacheLife, cacheTag } from "next/cache";

import { asc, auth, count, db, eq, sql, tracks, users } from "@repo/database";

import { DateUtils } from "~/lib/date-utils";

const DEFAULT_DATE_RANGE = {
	dateStart: new Date("2024-01-01"),
	dateEnd: new Date(),
};

export const getDateRange = async (userId: string, isDemo: boolean) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "date-range");

	if (isDemo) return DEFAULT_DATE_RANGE;

	const dates = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, userId),
		columns: { timeRangeDateEnd: true, timeRangeDateStart: true },
	});

	if (!dates || !dates.timeRangeDateStart || !dates.timeRangeDateEnd) {
		return DEFAULT_DATE_RANGE;
	}

	return {
		dateStart: dates.timeRangeDateStart,
		dateEnd: dates.timeRangeDateEnd,
	};
};

export const setDateRange = async (
	userId: string,
	dateStart: Date,
	dateEnd: Date,
) => {
	await db
		.update(users)
		.set({ timeRangeDateStart: dateStart, timeRangeDateEnd: dateEnd })
		.where(eq(users.id, userId));
};

export const getMinMaxDateRange = async (userId: string) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "min-max-date-range");

	const [minDate, maxDate] = await Promise.all([
		db.query.tracks.findFirst({
			where: (tracks, { eq }) => eq(tracks.userId, userId),
			orderBy: (tracks, { asc }) => asc(tracks.timestamp),
			columns: { timestamp: true },
		}),
		db.query.tracks.findFirst({
			where: (tracks, { eq }) => eq(tracks.userId, userId),
			orderBy: (tracks, { desc }) => desc(tracks.timestamp),
			columns: { timestamp: true },
		}),
	]);

	if (!minDate || !maxDate) return null;

	return {
		minDate: minDate.timestamp,
		maxDate: maxDate.timestamp,
	};
};

export const setDefaultDateRange = async (userId: string) => {
	const minMaxDateRange = await getMinMaxDateRange(userId);

	if (!minMaxDateRange) return;

	await setDateRange(userId, minMaxDateRange.minDate, minMaxDateRange.maxDate);
};

export const getDateRangeSliderData = async (userId: string) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "date-range-slider-data");

	const tracksData = await db
		.select({
			month: sql<string>`TO_CHAR(timestamp, 'YYYY-MM')`,
			count: count(),
		})
		.from(tracks)
		.where(auth(userId))
		.groupBy(({ month }) => month)
		.orderBy(({ month }) => asc(month));

	if (tracksData.length === 0) {
		return [];
	}

	const tracksMap = new Map<string, number>();
	tracksData.forEach((track) => {
		tracksMap.set(track.month, Number(track.count));
	});

	const firstMonth = new Date(tracksData[0].month);
	const lastMonth = new Date(tracksData[tracksData.length - 1].month);

	const result: { date: Date; value: number }[] = [];
	let currentMonth = new Date(
		firstMonth.getFullYear(),
		firstMonth.getMonth(),
		1,
	);
	const endMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);

	while (currentMonth <= endMonth) {
		const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`;
		const value = tracksMap.get(monthKey) || 0;

		result.push({
			date: new Date(currentMonth),
			value: value,
		});

		currentMonth = DateUtils.addMonths(currentMonth, 1);
	}

	return result;
};
