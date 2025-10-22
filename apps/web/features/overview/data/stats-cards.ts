"server-only";

import { cacheLife, cacheTag } from "next/cache";

import { auth, count, db, desc, sql, sum, tracks } from "@repo/database";

import { getMonthRange } from "~/lib/dal";

export const getStatsCardsData = async (userId: string, isDemo: boolean) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "stats-cards");

	const monthRange = await getMonthRange(userId, isDemo);

	const totalPlaysAndTimeQuery = db
		.select({ count: count(), sum: sum(tracks.msPlayed) })
		.from(tracks)
		.where(auth(userId, { monthRange }));

	const uniqueArtistsQuery = db
		.select({
			count: sql<number>`COUNT(DISTINCT "subquery".unnest)`.mapWith(Number),
		})
		.from(
			db
				.select({ artist_id: sql<string>`unnest(${tracks.artistIds})` })
				.from(tracks)
				.where(auth(userId, { monthRange }))
				.as("subquery"),
		);

	const mostActiveDayQuery = db
		.select({
			day: sql<string>`TO_CHAR(${tracks.timestamp}, 'YYYY-MM-DD')`,
			totalmsplayed: sum(tracks.msPlayed),
			totalcount: count(),
		})
		.from(tracks)
		.where(auth(userId, { monthRange }))
		.groupBy(({ day }) => day)
		.orderBy(({ totalmsplayed }) => desc(totalmsplayed))
		.limit(1);

	const [totalPlaysAndTime, uniqueArtists, mostActiveDay] = await Promise.all([
		totalPlaysAndTimeQuery,
		uniqueArtistsQuery,
		mostActiveDayQuery,
	]);

	const totalPlaysCount = totalPlaysAndTime[0]?.count ?? 0;
	const totalPlaysPerDay =
		totalPlaysCount /
		((monthRange.dateEnd.getTime() - monthRange.dateStart.getTime()) /
			(1000 * 60 * 60 * 24));

	return {
		listeningTime: Number(totalPlaysAndTime[0]?.sum) || 0,
		totalPlays: totalPlaysCount,
		totalPlaysPerDay: Math.round(totalPlaysPerDay) || 0,
		uniqueArtists: uniqueArtists[0]?.count ?? 0,
		mostActiveDay: {
			day: mostActiveDay[0]?.day ? new Date(mostActiveDay[0].day) : null,
			timePlayed: Number(mostActiveDay[0]?.totalmsplayed) || 0,
			totalPlayed: Number(mostActiveDay[0]?.totalcount) || 0,
		},
	};
};
