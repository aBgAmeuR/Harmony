"server-only";

import { format } from "date-fns";
import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { prisma } from "@repo/database";

import { formatMonth } from "~/lib/utils";

export const getListeningTabData = async (albumId: string, userId: string) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "album-detail", "listening-tab");

	const [monthlyTrends, timeDistribution, topDays] = await Promise.all([
		getAlbumMonthlyTrends(userId, albumId),
		getAlbumHourDistribution(userId, albumId),
		getAlbumTopDays(userId, albumId),
	]);

	return { monthlyTrends, timeDistribution, topDays };
};

async function getAlbumMonthlyTrends(userId: string, albumId: string) {
	const rows = await prisma.track.groupBy({
		by: ["albumId", "timestamp"],
		where: { userId, albumId },
		_sum: { msPlayed: true },
	});

	const dates = rows.map((row) => (row.timestamp as Date).getTime());
	if (dates.length === 0) return [];

	const minDate = new Date(Math.min(...dates));
	const maxDate = new Date(Math.max(...dates));

	const monthlyMap: Record<string, number> = {};
	const currentDate = new Date(minDate);
	while (currentDate <= maxDate) {
		monthlyMap[formatMonth(currentDate)] = 0;
		currentDate.setMonth(currentDate.getMonth() + 1);
	}

	for (const row of rows) {
		const date = row.timestamp as Date;
		const key = formatMonth(date);
		monthlyMap[key] = (monthlyMap[key] || 0) + Number(row._sum.msPlayed || 0);
	}

	return Object.entries(monthlyMap).map(([month, msPlayed]) => ({
		month,
		msPlayed: Number(msPlayed),
	}));
}

async function getAlbumHourDistribution(userId: string, albumId: string) {
	const listeningHabits = Array.from({ length: 24 }, (_, i) => ({
		hour: i,
		msPlayed: 0,
	}));

	const rows = await prisma.track.groupBy({
		by: ["albumId", "timestamp"],
		where: { userId, albumId },
		_sum: { msPlayed: true },
	});

	const hourMap: Record<number, number> = {};
	for (const row of rows) {
		const date = row.timestamp as Date;
		const hour = date.getHours();
		hourMap[hour] = (hourMap[hour] || 0) + Number(row._sum.msPlayed || 0);
	}

	return listeningHabits.map((habit) => ({
		hour: String(habit.hour),
		msPlayed: Number(hourMap[habit.hour] || 0),
	}));
}

async function getAlbumTopDays(userId: string, albumId: string) {
	const rows = await prisma.track.groupBy({
		by: ["albumId", "timestamp"],
		where: { userId, albumId },
		_sum: { msPlayed: true },
	});

	const dayMap: Record<string, number> = {};
	for (const row of rows) {
		const key = format(row.timestamp, "MMMM d, yyyy");
		dayMap[key] = (dayMap[key] || 0) + Number(row._sum.msPlayed || 0);
	}

	return Object.entries(dayMap)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 10)
		.map(([date, msPlayed]) => ({ date, msPlayed: Number(msPlayed) }));
}
