import { prisma } from "@repo/database";
import { spotify } from "@repo/spotify";
import type { Track } from "@repo/spotify/types";
import _ from "lodash";
import { generateMonthRange, getMonthIndex } from "./utils";

type MonthlyTrack = {
	month: string;
	spotifyId: string;
	msPlayed: bigint;
	count: bigint;
	rank: number;
};

export type MonthlyTrackData = {
	month: string;
	tracks: Array<{
		id: string;
		name: string;
		image?: string;
		spotifyUrl: string;
		artists: string;
		album: string;
		plays: number;
		msPlayed: number;
		trend?: "up" | "down" | "same" | "new";
		previousRank?: number;
	}>;
};

const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

/**
 * Returns the monthly top tracks for a user and artist, including trend and previous rank info.
 *
 * @param userId - The user ID
 * @param artistId - The artist ID
 * @param limit - The number of top tracks per month (default: 5)
 */
export const getMonthlyTopTracks = async (
	userId: string | undefined,
	artistId: string,
	limit = 5,
): Promise<MonthlyTrackData[]> => {
	if (!userId || !artistId) return [];

	try {
		const monthlyTracksData = await fetchMonthlyTracksData(
			userId,
			artistId,
			limit,
		);
		if (!monthlyTracksData.length) return [];

		// Group data by month and collect unique track IDs
		const groupedByMonth = _.groupBy(
			monthlyTracksData,
			(d: MonthlyTrack) => d.month,
		);
		const allTrackIds = _.uniq(
			monthlyTracksData.map((d: MonthlyTrack) => d.spotifyId),
		);
		const monthsArr = Object.keys(groupedByMonth);
		if (!monthsArr.length) return [];

		// Sort months chronologically
		const sortedMonths = _.sortBy(monthsArr, (m: string) => {
			const { year, monthIndex } = getMonthIndex(m, MONTHS);
			return year * 12 + monthIndex;
		});
		const first = getMonthIndex(sortedMonths[0], MONTHS);
		const last = getMonthIndex(sortedMonths[sortedMonths.length - 1], MONTHS);

		// Generate all months between first and last (inclusive)
		const allMonths = generateMonthRange(first, last, MONTHS);

		// Build trackDataMap for quick lookup
		const trackDataMap: Record<
			string,
			Record<string, { msPlayed: bigint; count: number; rank: number }>
		> = {};
		for (const [month, tracks] of Object.entries(groupedByMonth)) {
			trackDataMap[month] = {};
			(tracks as MonthlyTrack[]).forEach(
				({ spotifyId, msPlayed, count, rank }) => {
					trackDataMap[month][spotifyId] = {
						msPlayed,
						count: Number(count),
						rank,
					};
				},
			);
		}

		// Create previousRankMap using Lodash
		const previousRankMap: Record<string, Record<string, number>> = {};
		allMonths.forEach((month: string, i: number) => {
			if (i === 0) return;
			const prevMonth = allMonths[i - 1];
			previousRankMap[month] = _.mapValues(
				trackDataMap[prevMonth] || {},
				(v: { rank: number }) => v.rank,
			);
		});

		// Fetch all track details in a single API call
		let allTrackDetails: Track[] = [];
		try {
			allTrackDetails = await spotify.tracks.list(allTrackIds);
		} catch (spotifyError) {
			console.error("Failed to fetch Spotify tracks data:", spotifyError);
			allTrackDetails = [];
		}

		// Create a map of track details for quick lookup
		const trackDetailsMap: Record<string, Track> = _.keyBy(
			allTrackDetails,
			"id",
		);

		// Build results using Lodash for mapping
		const results: MonthlyTrackData[] = _(allMonths)
			.reverse()
			.map((month: string) => {
				const tracks = groupedByMonth[month] as MonthlyTrack[] | undefined;
				if (!tracks || !tracks.length) return { month, tracks: [] };
				return {
					month,
					tracks: tracks.map(({ spotifyId }) => {
						const trackDetail = trackDetailsMap[spotifyId];
						const stats = trackDataMap[month][spotifyId];
						const previousRank = previousRankMap[month]?.[spotifyId];
						let trend: "up" | "down" | "same" | "new" = "new";
						if (previousRank !== undefined) {
							if (previousRank < stats.rank) trend = "down";
							else if (previousRank > stats.rank) trend = "up";
							else trend = "same";
						}
						return {
							id: spotifyId,
							name:
								trackDetail?.name || `Unknown Track (${spotifyId.slice(0, 8)})`,
							image: trackDetail?.album?.images[0]?.url,
							spotifyUrl: trackDetail?.external_urls?.spotify,
							artists:
								trackDetail?.artists?.map((a) => a.name).join(", ") ||
								"Unknown Artist",
							album: trackDetail?.album?.name || "Unknown Album",
							plays: Number(stats.count),
							msPlayed: Number(stats.msPlayed),
							trend,
							previousRank:
								previousRank !== undefined ? Number(previousRank) : undefined,
						};
					}),
				};
			})
			.value();

		return results;
	} catch (error) {
		console.error("Failed to fetch monthly top tracks:", error);
		return [];
	}
};

/**
 * Fetches monthly track stats for a user and artist from the database.
 */
export const fetchMonthlyTracksData = async (
	userId: string,
	artistId: string,
	limit: number,
): Promise<MonthlyTrack[]> => {
	return prisma.$queryRaw<MonthlyTrack[]>`
    WITH monthly_tracks AS (
      SELECT
        TO_CHAR(timestamp, 'FMMonth YYYY') AS month,
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
      TO_DATE(month, 'Month YYYY') DESC,
      rank ASC
  `;
};
