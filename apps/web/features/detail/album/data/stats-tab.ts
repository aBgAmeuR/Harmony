"server-only";

import { format } from "date-fns";
import { cacheLife, cacheTag } from "next/cache";

import {
	and,
	auth,
	count,
	db,
	desc,
	eq,
	sql,
	sum,
	tracks,
} from "@repo/database";

import { formatMonth } from "~/lib/utils";

const MS_PER_MINUTE = 60000;
const MS_PER_DAY = 86400000;

const calculateMaxStreak = (dayRecords: { timestamp: string }[]): number => {
	if (dayRecords.length === 0) return 0;

	const uniqueDays = dayRecords.map((record) => new Date(record.timestamp));
	let maxStreak = 0;
	let currentStreak = 0;
	let prevDate: Date | null = null;

	for (const currentDate of uniqueDays) {
		const isConsecutiveDay =
			prevDate && currentDate.getTime() - prevDate.getTime() === MS_PER_DAY;

		if (isConsecutiveDay) {
			currentStreak++;
		} else {
			currentStreak = 1;
		}

		maxStreak = Math.max(maxStreak, currentStreak);
		prevDate = currentDate;
	}

	return maxStreak;
};

const getTopMonth = (
	monthlyStats: { month: string; msplayed: string | null; count: number }[],
) => {
	if (monthlyStats.length === 0) {
		return { month: "N/A", msPlayed: 0 };
	}

	const sortedByPlaytime = [...monthlyStats].sort(
		(a, b) => Number(b.msplayed) - Number(a.msplayed),
	);

	const topMonthData = sortedByPlaytime[0];
	return {
		month: formatMonth(new Date(topMonthData.month)),
		msPlayed: Math.round(Number(topMonthData.msplayed ?? 0) / MS_PER_MINUTE),
	};
};

const fetchMonthlyStats = async (albumId: string, userId: string) => {
	return await db
		.select({
			month: sql<string>`TO_CHAR(${tracks.timestamp}, 'YYYY-MM')`,
			msplayed: sum(tracks.msPlayed),
			count: count(),
		})
		.from(tracks)
		.where(and(auth(userId), eq(tracks.albumId, albumId)))
		.groupBy(({ month }) => month)
		.orderBy(({ month }) => month);
};

const fetchDayRecords = async (albumId: string, userId: string) => {
	return await db
		.select({
			timestamp: sql<string>`TO_CHAR(${tracks.timestamp}, 'YYYY-MM-DD')`,
		})
		.from(tracks)
		.where(and(auth(userId), eq(tracks.albumId, albumId)))
		.groupBy(({ timestamp }) => timestamp)
		.orderBy(({ timestamp }) => timestamp);
};

const fetchFirstAndLastListens = async (albumId: string, userId: string) => {
	return await Promise.all([
		db
			.select({ timestamp: tracks.timestamp })
			.from(tracks)
			.where(and(auth(userId), eq(tracks.albumId, albumId)))
			.orderBy(tracks.timestamp),
		db
			.select({ timestamp: tracks.timestamp })
			.from(tracks)
			.where(and(auth(userId), eq(tracks.albumId, albumId)))
			.orderBy(desc(tracks.timestamp)),
	]);
};

export const getStatsTabData = async (albumId: string, userId: string) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "album-detail", "stats-tab");

	try {
		const [monthlyStats, dayRecords, [firstListen, lastListen]] =
			await Promise.all([
				fetchMonthlyStats(albumId, userId),
				fetchDayRecords(albumId, userId),
				fetchFirstAndLastListens(albumId, userId),
			]);

		const totalStreams = monthlyStats.reduce(
			(acc, curr) => acc + Number(curr.count),
			0,
		);
		const totalMinutes = Math.round(
			monthlyStats.reduce((acc, curr) => acc + Number(curr.msplayed), 0) /
				MS_PER_MINUTE,
		);
		const maxStreak = calculateMaxStreak(dayRecords);
		const topMonth = getTopMonth(monthlyStats);

		const monthlyAveragePlays =
			monthlyStats.length > 0
				? Math.round(totalStreams / monthlyStats.length)
				: 0;

		return {
			totalMinutes,
			totalStreams,
			monthlyAveragePlays,
			topMonth,
			maxStreak,
			totalDays: dayRecords.length,
			firstListen: firstListen[0]?.timestamp
				? format(firstListen[0].timestamp, "MMMM d, yyyy")
				: null,
			lastListen: lastListen[0]?.timestamp
				? format(lastListen[0].timestamp, "MMMM d, yyyy")
				: null,
		};
	} catch (error) {
		console.error("Failed to fetch album stats:", error);
		return {
			totalMinutes: 0,
			totalStreams: 0,
			monthlyAveragePlays: 0,
			topMonth: {
				month: "N/A",
				msPlayed: 0,
			},
			maxStreak: 0,
			totalDays: 0,
			firstListen: null,
			lastListen: null,
		};
	}
};
