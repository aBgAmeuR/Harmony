"server-only";

import { prisma } from "@repo/database";
import { format } from "date-fns";
import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";
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
	monthlyStats: { month: string; msplayed: number; count: number }[],
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
		msPlayed: Math.round(Number(topMonthData.msplayed) / MS_PER_MINUTE),
	};
};

const fetchMonthlyStats = async (
	albumId: string,
	userId: string,
): Promise<{ month: string; msplayed: number; count: number }[]> => {
	return await prisma.$queryRaw<
		{ month: string; msplayed: number; count: number }[]
	>`
		SELECT TO_CHAR(timestamp, 'YYYY-MM') as month, 
			   SUM("msPlayed") as msplayed, 
			   COUNT(*) as count
		FROM "Track"
		WHERE "userId" = ${userId} 
		AND "albumId" = ${albumId}
		GROUP BY month
		ORDER BY month ASC
	`;
};

const fetchDayRecords = async (
	albumId: string,
	userId: string,
): Promise<{ timestamp: string }[]> => {
	return await prisma.$queryRaw<{ timestamp: string }[]>`
		SELECT TO_CHAR(timestamp, 'YYYY-MM-DD') as timestamp
		FROM "Track"
		WHERE "userId" = ${userId} 
		AND "albumId" = ${albumId}
		GROUP BY timestamp
		ORDER BY timestamp ASC
	`;
};

const fetchFirstAndLastListens = async (albumId: string, userId: string) => {
	return await Promise.all([
		prisma.track.findFirst({
			where: { userId, albumId },
			orderBy: { timestamp: "asc" },
			select: { timestamp: true },
		}),
		prisma.track.findFirst({
			where: { userId, albumId },
			orderBy: { timestamp: "desc" },
			select: { timestamp: true },
		}),
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
			firstListen: firstListen?.timestamp
				? format(firstListen.timestamp, "MMMM d, yyyy")
				: null,
			lastListen: lastListen?.timestamp
				? format(lastListen.timestamp, "MMMM d, yyyy")
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
