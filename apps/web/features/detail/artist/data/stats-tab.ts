"server-only";

import { cacheLife, cacheTag } from "next/cache";

import { and, arrayOverlaps, auth, db, sql, sum, tracks } from "@repo/database";

import { formatMonth } from "~/lib/utils";

export const getStatsTabData = async (artistId: string, userId: string) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "artist-detail", "stats-tab");

	const listeningHabits = Array.from({ length: 24 }, (_, i) => ({
		hour: i,
		msPlayed: 0,
	}));

	const [hourData, monthData] = await Promise.all([
		db
			.select({
				hour: sql<number>`EXTRACT(HOUR FROM ${tracks.timestamp})`,
				msplayed: sum(tracks.msPlayed),
			})
			.from(tracks)
			.where(and(auth(userId), arrayOverlaps(tracks.artistIds, [artistId])))
			.groupBy(({ hour }) => hour)
			.orderBy(({ hour }) => hour),
		db
			.select({
				month: sql<string>`TO_CHAR(${tracks.timestamp}, 'YYYY-MM')`,
				totalmsplayed: sum(tracks.msPlayed),
			})
			.from(tracks)
			.where(and(auth(userId), arrayOverlaps(tracks.artistIds, [artistId])))
			.groupBy(({ month }) => month)
			.orderBy(({ month }) => month),
	]);

	const monthDataClean: Record<string, number> = {};

	monthData.forEach((track) => {
		const date = new Date(track.month);
		const key = formatMonth(date);
		monthDataClean[key] = Number(track.totalmsplayed);
	});

	const monthlyTrends = Object.entries(monthDataClean).map(([key, value]) => ({
		month: key,
		msPlayed: Number(value),
	}));

	const timeDistribution = listeningHabits.map((habit) => {
		const dataItem = hourData.find((d) => Number(d.hour) === habit.hour);

		return {
			hour: String(habit.hour),
			msPlayed: dataItem ? Number(dataItem.msplayed) : 0,
		};
	});

	return {
		monthlyTrends,
		timeDistribution,
	};
};
