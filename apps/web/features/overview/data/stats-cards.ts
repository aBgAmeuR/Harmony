"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { and, db, desc, eq, gte, lt, sql, tracks } from "@repo/database";

import { getMonthRange } from "~/lib/dal";

export const getStatsCardsData = async (userId: string, isDemo: boolean) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "stats-cards");

	const monthRange = await getMonthRange(userId, isDemo);

	const listeningTimeQuery = db
		.select({
			total: sql<number>`SUM(${tracks.msPlayed})`,
		})
		.from(tracks)
		.where(
			and(
				eq(tracks.userId, userId),
				gte(tracks.timestamp, monthRange.dateStart),
				lt(tracks.timestamp, monthRange.dateEnd),
			),
		);

	const totalPlaysQuery = db
		.select({
			count: sql<number>`COUNT(*)`,
		})
		.from(tracks)
		.where(
			and(
				eq(tracks.userId, userId),
				gte(tracks.timestamp, monthRange.dateStart),
				lt(tracks.timestamp, monthRange.dateEnd),
			),
		);

	const uniqueArtistsQuery = db
		.select({
			artistIds: tracks.artistIds,
		})
		.from(tracks)
		.where(
			and(
				eq(tracks.userId, userId),
				gte(tracks.timestamp, monthRange.dateStart),
				lt(tracks.timestamp, monthRange.dateEnd),
			),
		);

	const mostActiveDayQuery = db
		.select({
			day: sql<string>`TO_CHAR(${tracks.timestamp}, 'YYYY-MM-DD')`,
			totalmsplayed: sql<number>`SUM(${tracks.msPlayed})`,
			totalcount: sql<number>`COUNT(*)`,
		})
		.from(tracks)
		.where(
			and(
				eq(tracks.userId, userId),
				gte(tracks.timestamp, monthRange.dateStart),
				lt(tracks.timestamp, monthRange.dateEnd),
			),
		)
		.groupBy(({ day }) => day)
		.orderBy(({ totalmsplayed }) => desc(totalmsplayed))
		.limit(1);

	const [listeningTimeRes, totalPlays, uniqueArtists, mostActiveDay] =
		await Promise.all([
			listeningTimeQuery,
			totalPlaysQuery,
			uniqueArtistsQuery,
			mostActiveDayQuery,
		]);

	const totalPlaysCount = totalPlays[0]?.count ?? 0;
	const totalPlaysPerDay =
		totalPlaysCount /
		((monthRange.dateEnd.getTime() - monthRange.dateStart.getTime()) /
			(1000 * 60 * 60 * 24));

	const artistIdSet = new Set(
		uniqueArtists.flatMap((row: { artistIds: string[] }) => row.artistIds),
	);

	return {
		listeningTime: Number(listeningTimeRes[0]?.total) || 0,
		totalPlays: totalPlaysCount,
		totalPlaysPerDay: Math.round(totalPlaysPerDay) || 0,
		uniqueArtists: artistIdSet.size || 0,
		mostActiveDay: {
			day: mostActiveDay[0]?.day ? new Date(mostActiveDay[0].day) : null,
			timePlayed: Number(mostActiveDay[0]?.totalmsplayed) || 0,
			totalPlayed: Number(mostActiveDay[0]?.totalcount) || 0,
		},
	};
};
