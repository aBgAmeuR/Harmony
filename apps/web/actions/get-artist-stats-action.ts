"use server";

import { prisma } from "@repo/database";
import { spotify } from "@repo/spotify";
import { format, localeFormat } from "light-date";
import { cache } from "react";

const formatMonth = (date: Date) =>
	`${localeFormat(date, "{MMMM}")} ${format(date, "{yyyy}")}`;

export const getArtistStatsAction = cache(
	async (userId: string | undefined, artistId: string) => {
		if (!userId) return null;

		try {
			const [[{ totalMinutes = 0, totalStreams = 0 }]] =
				await prisma.$transaction([
					prisma.$queryRaw<
						{
							totalMinutes: number;
							totalStreams: number;
						}[]
					>`
        SELECT
          ROUND(SUM("msPlayed")::numeric / 1000 / 60) AS "totalMinutes",
          COUNT(*) AS "totalStreams"
        FROM "Track"
        WHERE "userId" = ${userId}
          AND ${artistId} = ANY("artistIds")
      `,
				]);

			return {
				totalMinutes: Number(totalMinutes),
				totalStreams: Number(totalStreams),
			};
		} catch (error) {
			console.error("Failed to fetch artist stats:", error);
			return null;
		}
	},
);

export const getArtistListeningTrends = async (
	userId: string | undefined,
	artistId: string,
) => {
	if (!userId) return null;

	const listeningHabits = Array.from({ length: 24 }, (_, i) => {
		return {
			hour: i,
			msPlayed: 0,
		};
	});

	const [hourData, monthData] = await prisma.$transaction([
		prisma.$queryRaw<{ hour: bigint; msplayed: bigint }[]>`
      SELECT
        EXTRACT(HOUR FROM timestamp) AS hour,
        SUM("msPlayed") AS msplayed
      FROM "Track"
      WHERE "userId" = ${userId} AND ${artistId} = ANY("artistIds")
      GROUP BY hour
      ORDER BY hour ASC
    `,
		prisma.$queryRaw<{ month: string; totalmsplayed: number }[]>`
      SELECT TO_CHAR(timestamp, 'YYYY-MM') as month, SUM("msPlayed") as totalmsplayed
      FROM "Track"
      WHERE "userId" = ${userId} AND ${artistId} = ANY("artistIds")
      GROUP BY month
      ORDER BY month ASC
    `,
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

export const getArtistDetails = cache(async (artistId: string) => {
	return await spotify.artists.get(artistId);
});
