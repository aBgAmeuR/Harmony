"use server";

import { prisma } from "@repo/database";
import { spotify } from "@repo/spotify";
import { format, localeFormat } from "light-date";

export type MonthlyTrackData = {
  month: string;
  tracks: Array<{
    id: string;
    name: string;
    image?: string;
    artists: string;
    album: string;
    plays: number;
    minutes: number;
    trend?: "up" | "down" | "same" | "new"; // Trend compared to previous month
    previousRank?: number; // Position in previous month, if available
  }>;
};

export const getMonthlyTopTracksAction = async (
  userId: string | undefined,
  artistId: string,
  limit: number = 5,
): Promise<MonthlyTrackData[]> => {
  if (!userId || !artistId) return [];

  try {
    // Get all tracks for the artist from the user's history
    const artistTracks = await prisma.track.findMany({
      where: {
        userId,
        artistIds: { has: artistId },
      },
      select: {
        msPlayed: true,
        timestamp: true,
        spotifyId: true,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    if (!artistTracks.length) return [];

    // Group tracks by month
    const tracksByMonth: Record<
      string,
      Record<string, { msPlayed: bigint; count: number }>
    > = {};

    artistTracks.forEach((track) => {
      const month = formatDate(track.timestamp);
      if (!tracksByMonth[month]) {
        tracksByMonth[month] = {};
      }

      if (!tracksByMonth[month][track.spotifyId]) {
        tracksByMonth[month][track.spotifyId] = {
          msPlayed: BigInt(0),
          count: 0,
        };
      }

      tracksByMonth[month][track.spotifyId].msPlayed += track.msPlayed;
      tracksByMonth[month][track.spotifyId].count += 1;
    });

    // Calculate rankings for all months
    const monthlyRankings: Record<string, Record<string, number>> = {};

    Object.entries(tracksByMonth).forEach(([month, trackMap]) => {
      const sortedTracks = Object.entries(trackMap).sort(
        ([, a], [, b]) => b.count - a.count,
      );

      monthlyRankings[month] = {};
      sortedTracks.forEach(([trackId], index) => {
        monthlyRankings[month][trackId] = index + 1;
      });
    });

    // Sort months chronologically for comparing rankings
    const sortedMonths = Object.keys(tracksByMonth).sort((a, b) => {
      const dateA = parseMonthString(a);
      const dateB = parseMonthString(b);
      return dateA.getTime() - dateB.getTime();
    });

    // Process each month to get top tracks with ranking trends
    const results = await Promise.all(
      sortedMonths.map(async (month, monthIndex) => {
        const trackMap = tracksByMonth[month];

        // Get top tracks for the month based on play count
        const topTrackIds = Object.entries(trackMap)
          .sort(([, a], [, b]) => b.count - a.count)
          .slice(0, limit)
          .map(([id]) => id);

        if (topTrackIds.length === 0) {
          return { month, tracks: [] };
        }

        // Get previous month for trend comparison
        const previousMonth =
          monthIndex > 0 ? sortedMonths[monthIndex - 1] : null;

        const previousMonthRankings = previousMonth
          ? monthlyRankings[previousMonth]
          : {};

        try {
          // Fetch track details from Spotify API
          const uniqueTopTrackIds = Array.from(new Set(topTrackIds));
          const trackDetails = await spotify.tracks.list(uniqueTopTrackIds);

          // Map track details with play statistics and trends
          const tracks = topTrackIds.map((id, currentRank) => {
            const trackDetail = trackDetails.find((t) => t.id === id);
            const stats = trackMap[id];

            // Calculate trend
            let trend: "up" | "down" | "same" | "new" = "new";
            let previousRank: number | undefined = undefined;

            if (previousMonth && previousMonthRankings[id]) {
              previousRank = previousMonthRankings[id];

              if (previousRank < currentRank + 1) {
                trend = "down";
              } else if (previousRank > currentRank + 1) {
                trend = "up";
              } else {
                trend = "same";
              }
            }

            return {
              id,
              name: trackDetail?.name || `Unknown Track (${id.slice(0, 8)})`,
              image: trackDetail?.album?.images[0]?.url,
              artists:
                trackDetail?.artists?.map((a) => a.name).join(", ") ||
                "Unknown Artist",
              album: trackDetail?.album?.name || "Unknown Album",
              plays: stats.count,
              minutes: Math.round(Number(stats.msPlayed) / (1000 * 60)),
              trend,
              previousRank,
            };
          });

          return { month, tracks };
        } catch (spotifyError) {
          console.error(
            `Failed to fetch Spotify tracks data for ${month}:`,
            spotifyError,
          );

          // Fallback with minimal information when Spotify API fails
          const tracks = topTrackIds.map((id, currentRank) => {
            // Calculate trend
            let trend: "up" | "down" | "same" | "new" = "new";
            let previousRank: number | undefined = undefined;

            if (previousMonth && previousMonthRankings[id]) {
              previousRank = previousMonthRankings[id];

              if (previousRank < currentRank + 1) {
                trend = "down";
              } else if (previousRank > currentRank + 1) {
                trend = "up";
              } else {
                trend = "same";
              }
            }

            return {
              id,
              name: `Track ${id.slice(0, 8)}...`,
              artists: "Artist information unavailable",
              album: "Album information unavailable",
              plays: trackMap[id].count,
              minutes: Math.round(Number(trackMap[id].msPlayed) / (1000 * 60)),
              trend,
              previousRank,
            };
          });

          return { month, tracks };
        }
      }),
    );

    // Sort by date (most recent first)
    return results
      .filter((month) => month.tracks.length > 0)
      .sort((a, b) => {
        const dateA = parseMonthString(a.month);
        const dateB = parseMonthString(b.month);
        return dateB.getTime() - dateA.getTime();
      });
  } catch (error) {
    console.error("Failed to fetch monthly top tracks:", error);
    return [];
  }
};

// Helper to format dates consistently
const formatDate = (date: Date): string =>
  `${localeFormat(date, "{MMM}")} ${format(date, "{yyyy}")}`;

// Helper to parse month strings back to dates for sorting
const parseMonthString = (monthStr: string): Date => {
  const [monthName, yearStr] = monthStr.split(" ");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthIndex = monthNames.findIndex((m) => m === monthName);

  return new Date(parseInt(yearStr), monthIndex);
};
