"server-only";

import { prisma } from "@repo/database";
import { getUserInfos } from "~/lib/utils";

const DEFAULT_DATE_RANGE = {
	dateStart: new Date("2024-01-01"),
	dateEnd: new Date(),
};

export const getDateRange = async (userId: string, isDemo: boolean) => {
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
