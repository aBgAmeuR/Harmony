"use server";

import { cache } from "react";
import { prisma } from "@repo/database";
import { spotify } from "@repo/spotify";
import { format, localeFormat } from "light-date";

type MonthlyStats = {
  month: string;
  msPlayed: number;
};

type HourlyStats = {
  hour: string;
  msPlayed: number;
};

const formatMonth = (date: Date) =>
  `${localeFormat(date, "{MMMM}")} ${format(date, "{yyyy}")}`;

export const getArtistStatsAction = cache(
  async (userId: string | undefined, artistId: string) => {
    if (!userId) return null;

    try {
      // Execute all queries in a single transaction
      const [monthlyStats, hourlyStats, [{ totalMinutes, totalStreams }]] =
        await prisma.$transaction([
          prisma.$queryRaw<
            {
              month: string;
              year: number;
              month_num: number;
              msplayed: number;
              streams: number;
            }[]
          >`
        SELECT
          TO_CHAR(timestamp, 'Mon') AS month,
          EXTRACT(YEAR FROM timestamp) AS year,
          EXTRACT(MONTH FROM timestamp) AS month_num,
          ROUND(SUM("msPlayed")::numeric) AS msplayed,
          COUNT(*) AS streams
        FROM "Track"
        WHERE "userId" = ${userId}
          AND ${artistId} = ANY("artistIds")
        GROUP BY month, year, month_num
        ORDER BY year, month_num
      `,
          prisma.$queryRaw<
            {
              hour: number;
              msplayed: number;
            }[]
          >`
        SELECT
          EXTRACT(HOUR FROM timestamp) AS hour,
          ROUND(SUM("msPlayed")::numeric) AS msplayed
        FROM "Track"
        WHERE "userId" = ${userId}
          AND ${artistId} = ANY("artistIds")
        GROUP BY hour
        ORDER BY hour
      `,
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

      if (monthlyStats.length === 0) return null;

      // Format monthly trends
      const monthlyTrends: MonthlyStats[] = monthlyStats.map(
        ({ month, year, msplayed }) => ({
          month: `${month} ${year}`,
          msPlayed: Number(msplayed),
        })
      );

      // Format hourly stats (ensure all 24 hours are represented)
      const timeDistribution: HourlyStats[] = Array.from(
        { length: 24 },
        (_, i) => {
          const hour = i.toString().padStart(2, "0");
          const foundHour = hourlyStats.find((stat) => Number(stat.hour) === i);
          return {
            hour,
            msPlayed: foundHour ? Number(foundHour.msplayed) : 0,
          };
        }
      );

      // Find top month
      const topMonth = monthlyTrends.reduce(
        (max, current) =>
          current.msPlayed > (max?.msPlayed || 0) ? current : max,
        monthlyTrends[0]
      );

      // Calculate averages
      const monthlyAverageStreams = Math.round(
        Number(totalStreams) / monthlyTrends.length
      );
      const monthlyAverageMinutes = Math.round(
        Number(totalMinutes) / monthlyTrends.length
      );

      // Calculate progress to next milestone (next 100 streams)
      const streamProgress = (Number(totalStreams) % 100) / 100;

      return {
        totalMinutes: Number(totalMinutes),
        totalStreams: Number(totalStreams),
        monthlyTrends,
        timeDistribution,
        topMonth,
        monthlyAverageStreams,
        monthlyAverageMinutes,
        streamProgress,
      };
    } catch (error) {
      console.error("Failed to fetch artist stats:", error);
      return null;
    }
  }
);

export const getArtistListeningTrends = async (
  userId: string | undefined,
  artistId: string
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
