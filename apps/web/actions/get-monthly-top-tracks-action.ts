"use server";

import { prisma } from "@repo/database";
import { spotify } from "@repo/spotify";
import { Track } from "@repo/spotify/types";

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
    // Fetch monthly top tracks data with SQL-based aggregation
    const monthlyTracksData: {
      month: string;
      spotifyId: string;
      msPlayed: bigint;
      count: bigint;
      rank: number;
    }[] = await prisma.$queryRaw`
      WITH monthly_tracks AS (
        SELECT
          TO_CHAR(timestamp, 'Mon YYYY') AS month,
          EXTRACT(YEAR FROM timestamp) AS year,
          EXTRACT(MONTH FROM timestamp) AS month_num,
          "spotifyId",
          SUM("msPlayed") AS "msPlayed",
          COUNT(*) AS count
        FROM "Track"
        WHERE "userId" = ${userId}
          AND ${artistId} = ANY("artistIds")
        GROUP BY month, year, month_num, "spotifyId"
      ),
      ranked_tracks AS (
        SELECT
          month,
          "spotifyId",
          "msPlayed",
          count,
          RANK() OVER (PARTITION BY month ORDER BY count DESC, "msPlayed" DESC) AS rank
        FROM monthly_tracks
      )
      SELECT 
        month,
        "spotifyId",
        "msPlayed",
        count,
        rank
      FROM ranked_tracks
      WHERE rank <= ${limit}
      ORDER BY 
        TO_DATE(month, 'Mon YYYY') DESC,
        rank ASC
    `;

    if (!monthlyTracksData.length) return [];

    // Get unique months from data
    const monthsSet = new Set<string>();
    const trackIdsByMonth: Record<string, string[]> = {};
    const trackDataMap: Record<
      string,
      Record<string, { msPlayed: bigint; count: number; rank: number }>
    > = {};

    // Collect all unique track IDs across all months
    const allTrackIds = new Set<string>();

    // Organize data by month
    monthlyTracksData.forEach(({ month, spotifyId, msPlayed, count, rank }) => {
      monthsSet.add(month);
      allTrackIds.add(spotifyId);

      if (!trackIdsByMonth[month]) {
        trackIdsByMonth[month] = [];
      }
      trackIdsByMonth[month].push(spotifyId);

      if (!trackDataMap[month]) {
        trackDataMap[month] = {};
      }
      trackDataMap[month][spotifyId] = {
        msPlayed,
        count: Number(count),
        rank,
      };
    });

    // Get previous month rankings for trend calculation
    const months = Array.from(monthsSet).sort((a, b) => {
      const dateA = parseMonthString(a);
      const dateB = parseMonthString(b);
      return dateB.getTime() - dateA.getTime(); // Sort in reverse chronological order
    });

    // Create a map of tracks to their previous month ranking
    const previousRankMap: Record<string, Record<string, number>> = {};
    months.forEach((month, i) => {
      if (i < months.length - 1) {
        const nextMonth = months[i + 1];
        previousRankMap[nextMonth] = {};

        const currentMonthTracks = trackDataMap[month];
        Object.entries(currentMonthTracks).forEach(([trackId, { rank }]) => {
          previousRankMap[nextMonth][trackId] = rank;
        });
      }
    });

    // Fetch all track details in a single API call
    const uniqueTrackIds = Array.from(allTrackIds);
    let allTrackDetails: Track[] = [];

    try {
      allTrackDetails = await spotify.tracks.list(uniqueTrackIds);
    } catch (spotifyError) {
      console.error("Failed to fetch Spotify tracks data:", spotifyError);
      allTrackDetails = [];
    }

    // Create a map of track details for quick lookup
    const trackDetailsMap: Record<string, Track> = {};
    allTrackDetails.forEach((track) => {
      if (track && track.id) {
        trackDetailsMap[track.id] = track;
      }
    });

    // Process each month's data using the pre-fetched track details
    const results = months.map((month) => {
      const trackIds = trackIdsByMonth[month] || [];

      if (!trackIds.length) {
        return { month, tracks: [] };
      }

      // Map track details with play statistics and trends
      const tracks = trackIds.map((id) => {
        const trackDetail = trackDetailsMap[id];
        const stats = trackDataMap[month][id];
        const previousRank = previousRankMap[month]?.[id];

        // Calculate trend
        let trend: "up" | "down" | "same" | "new" = "new";

        if (previousRank !== undefined) {
          if (previousRank < stats.rank) {
            trend = "down";
          } else if (previousRank > stats.rank) {
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
    });

    return results.filter((month) => month.tracks.length > 0);
  } catch (error) {
    console.error("Failed to fetch monthly top tracks:", error);
    return [];
  }
};

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
