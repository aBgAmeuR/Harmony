"use server";

import { prisma } from "@repo/database";
import { format, localeFormat } from "light-date";

type MonthlyStats = {
  month: string;
  minutes: number;
  streams: number;
};

type HourlyStats = {
  hour: string;
  minutes: number;
};

export const getArtistStatsAction = async (
  userId: string | undefined,
  artistId: string,
) => {
  if (!userId) return null;

  const artistTracks = await prisma.track.findMany({
    where: {
      userId,
      artistIds: { has: artistId },
    },
    orderBy: { timestamp: "asc" },
    select: { msPlayed: true, timestamp: true },
  });

  if (artistTracks.length === 0) return null;

  // Calculate total stats
  const totalMinutes = Math.round(
    Number(
      artistTracks.reduce((sum, track) => sum + track.msPlayed, BigInt(0)),
    ) /
      1000 /
      60,
  );
  const totalStreams = artistTracks.length;

  // Calculate monthly trends
  const monthlyTrends = aggregateMonthlyStats(artistTracks);
  const timeDistribution = aggregateHourlyStats(artistTracks);

  // Find top month
  const topMonth = findTopMonth(monthlyTrends);

  // Calculate averages
  const monthlyAverageStreams = Math.round(totalStreams / monthlyTrends.length);
  const monthlyAverageMinutes = Math.round(totalMinutes / monthlyTrends.length);

  // Calculate progress to next milestone (next 100 streams)
  const nextMilestone = Math.ceil(totalStreams / 100) * 100;
  const streamProgress = (totalStreams % 100) / 100;

  return {
    totalMinutes,
    totalStreams,
    monthlyTrends,
    timeDistribution,
    topMonth,
    monthlyAverageStreams,
    monthlyAverageMinutes,
    streamProgress,
  };
};

function aggregateMonthlyStats(
  tracks: {
    timestamp: Date;
    msPlayed: bigint;
  }[],
): MonthlyStats[] {
  const monthlyData: Record<string, { minutes: number; streams: number }> = {};

  tracks.forEach((track) => {
    const month = formatDate(track.timestamp);
    if (!monthlyData[month]) {
      monthlyData[month] = { minutes: 0, streams: 0 };
    }
    monthlyData[month].minutes += Math.round(
      Number(track.msPlayed) / 1000 / 60,
    );
    monthlyData[month].streams += 1;
  });

  return Object.entries(monthlyData).map(([month, stats]) => ({
    month,
    ...stats,
  }));
}

function aggregateHourlyStats(
  tracks: {
    timestamp: Date;
    msPlayed: bigint;
  }[],
): HourlyStats[] {
  const hourlyData: Record<string, number> = {};

  // Initialize all hours to 0
  for (let i = 0; i < 24; i++) {
    hourlyData[i.toString().padStart(2, "0")] = 0;
  }

  tracks.forEach((track) => {
    const hour = format(track.timestamp, "{HH}");
    hourlyData[hour] += Math.round(Number(track.msPlayed) / 1000 / 60);
  });

  return Object.entries(hourlyData)
    .map(([hour, minutes]) => ({
      hour,
      minutes,
    }))
    .sort((a, b) => a.hour.localeCompare(b.hour));
}

function findTopMonth(monthlyTrends: MonthlyStats[]) {
  return monthlyTrends.reduce(
    (max, current) => (current.streams > (max?.streams || 0) ? current : max),
    monthlyTrends[0],
  );
}

const formatDate = (date: Date) =>
  `${localeFormat(date, "{MMM}")} ${format(date, "{yyyy}")}`;
