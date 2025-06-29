"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { prisma } from "@repo/database";

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

	const dates = await prisma.user.findFirst({
		where: { id: userId },
		select: { timeRangeDateEnd: true, timeRangeDateStart: true },
	});

	if (!dates) return DEFAULT_DATE_RANGE;

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
	await prisma.user.update({
		where: { id: userId },
		data: { timeRangeDateStart: dateStart, timeRangeDateEnd: dateEnd },
	});
};

export const getMinMaxDateRange = async (userId: string) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "min-max-date-range");

	const [minDate, maxDate] = await Promise.all([
		prisma.track.findFirst({
			where: { userId },
			select: { timestamp: true },
			orderBy: { timestamp: "asc" },
		}),
		prisma.track.findFirst({
			where: { userId },
			select: { timestamp: true },
			orderBy: { timestamp: "desc" },
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

	const tracks = await prisma.$queryRaw<{ month: string; count: number }[]>`
    SELECT TO_CHAR(timestamp, 'YYYY-MM') as month, COUNT(*) as count
    FROM "Track"
    WHERE "userId" = ${userId}
    GROUP BY month
    ORDER BY month ASC
  `;

	if (tracks.length === 0) {
		return [];
	}

	const tracksMap = new Map<string, number>();
	tracks.forEach((track) => {
		tracksMap.set(track.month, Number(track.count));
	});

	const firstMonth = new Date(tracks[0].month);
	const lastMonth = new Date(tracks[tracks.length - 1].month);

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
