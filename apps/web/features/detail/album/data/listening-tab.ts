"server-only";

import { cache } from "react";
import { format } from "date-fns";
import { cacheLife, cacheTag } from "next/cache";

import { and, auth, db, eq, sum, tracks } from "@repo/database";

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
	const rows = await getRows(userId, albumId);

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
		monthlyMap[key] = (monthlyMap[key] || 0) + Number(row.msPlayed || 0);
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

	const rows = await getRows(userId, albumId);

	const hourMap: Record<number, number> = {};
	for (const row of rows) {
		const date = row.timestamp as Date;
		const hour = date.getHours();
		hourMap[hour] = (hourMap[hour] || 0) + Number(row.msPlayed || 0);
	}

	return listeningHabits.map((habit) => ({
		hour: String(habit.hour),
		msPlayed: Number(hourMap[habit.hour] || 0),
	}));
}

async function getAlbumTopDays(userId: string, albumId: string) {
	const rows = await getRows(userId, albumId);

	const dayMap: Record<string, number> = {};
	for (const row of rows) {
		const key = format(row.timestamp, "MMMM d, yyyy");
		dayMap[key] = (dayMap[key] || 0) + Number(row.msPlayed || 0);
	}

	return Object.entries(dayMap)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 10)
		.map(([date, msPlayed]) => ({ date, msPlayed: Number(msPlayed) }));
}

const getRows = cache(async (userId: string, albumId: string) => {
	return await db
		.select({
			albumId: tracks.albumId,
			timestamp: tracks.timestamp,
			msPlayed: sum(tracks.msPlayed),
		})
		.from(tracks)
		.where(and(auth(userId), eq(tracks.albumId, albumId)))
		.groupBy(tracks.albumId, tracks.timestamp);
});
