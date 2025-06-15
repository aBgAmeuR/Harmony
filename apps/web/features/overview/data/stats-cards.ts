"server-only";

import { prisma } from "@repo/database";
import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";
import { getMonthRange } from "~/lib/dal";

export const getStatsCardsData = async (userId: string, isDemo: boolean) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "stats-cards");

	const monthRange = await getMonthRange(userId, isDemo);

	const listeningTimeQuery = prisma.track.aggregate({
		_sum: { msPlayed: true },
		where: {
			userId,
			timestamp: { gte: monthRange.dateStart, lt: monthRange.dateEnd },
		},
	});

	const totalPlaysQuery = prisma.track.count({
		where: {
			userId,
			timestamp: { gte: monthRange.dateStart, lt: monthRange.dateEnd },
		},
	});

	const uniqueArtistsQuery = prisma.track.groupBy({
		by: ["artistIds"],
		_count: { _all: true },
		where: {
			userId,
			timestamp: { gte: monthRange.dateStart, lt: monthRange.dateEnd },
		},
	});

	const mostActiveDayQuery = prisma.$queryRaw<
		{
			day: string;
			totalmsplayed: number;
			totalcount: number;
		}[]
	>`
    SELECT 
      TO_CHAR(timestamp, 'YYYY-MM-DD') AS day,
      SUM("msPlayed") as totalmsplayed,
      COUNT(*) as totalcount
    FROM "Track"
    WHERE "userId" = ${userId}
      AND timestamp BETWEEN ${monthRange.dateStart} AND ${monthRange.dateEnd}
    GROUP BY day
    ORDER BY totalmsplayed DESC
    LIMIT 1
  `;

	const [listeningTime, totalPlays, uniqueArtists, mostActiveDay] =
		await Promise.all([
			listeningTimeQuery,
			totalPlaysQuery,
			uniqueArtistsQuery,
			mostActiveDayQuery,
		]);

	const totalPlaysPerDay =
		totalPlays /
		((monthRange.dateEnd.getTime() - monthRange.dateStart.getTime()) /
			(1000 * 60 * 60 * 24));

	return {
		listeningTime: Number(listeningTime?._sum?.msPlayed) || 0,
		totalPlays: totalPlays || 0,
		totalPlaysPerDay: Math.round(totalPlaysPerDay) || 0,
		uniqueArtists: uniqueArtists.length || 0,
		mostActiveDay: {
			day: mostActiveDay[0]?.day ? new Date(mostActiveDay[0].day) : null,
			timePlayed: Number(mostActiveDay[0]?.totalmsplayed) || 0,
			totalPlayed: Number(mostActiveDay[0]?.totalcount) || 0,
		},
	};
};
