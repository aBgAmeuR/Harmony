"use server";

import { cache } from "react";
import { prisma } from "@repo/database";
import { spotify } from "@repo/spotify";

type MonthlyStats = {
  month: string;
  minutes: number;
  streams: number;
};

type HourlyStats = {
  hour: string;
  minutes: number;
};

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
              minutes: number;
              streams: number;
            }[]
          >`
        SELECT
          TO_CHAR(timestamp, 'Mon') AS month,
          EXTRACT(YEAR FROM timestamp) AS year,
          EXTRACT(MONTH FROM timestamp) AS month_num,
          ROUND(SUM("msPlayed")::numeric / 1000 / 60) AS minutes,
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
              minutes: number;
            }[]
          >`
        SELECT
          EXTRACT(HOUR FROM timestamp) AS hour,
          ROUND(SUM("msPlayed")::numeric / 1000 / 60) AS minutes
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
        ({ month, year, minutes, streams }) => ({
          month: `${month} ${year}`,
          minutes: Number(minutes),
          streams: Number(streams),
        }),
      );

      // Format hourly stats (ensure all 24 hours are represented)
      const timeDistribution: HourlyStats[] = Array.from(
        { length: 24 },
        (_, i) => {
          const hour = i.toString().padStart(2, "0");
          const foundHour = hourlyStats.find((stat) => Number(stat.hour) === i);
          return {
            hour,
            minutes: foundHour ? Number(foundHour.minutes) : 0,
          };
        },
      );

      // Find top month
      const topMonth = monthlyTrends.reduce(
        (max, current) =>
          current.streams > (max?.streams || 0) ? current : max,
        monthlyTrends[0],
      );

      // Calculate averages
      const monthlyAverageStreams = Math.round(
        Number(totalStreams) / monthlyTrends.length,
      );
      const monthlyAverageMinutes = Math.round(
        Number(totalMinutes) / monthlyTrends.length,
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
  },
);

export const getArtistDetails = cache(async (artistId: string) => {
  return await spotify.artists.get(artistId);
});
