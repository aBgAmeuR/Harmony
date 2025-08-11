"server-only";

import _ from "lodash";

import { db, sql } from "@repo/database";
import { spotify } from "@repo/spotify";
import type { Track } from "@repo/spotify/types";

import type { MusicItemCardProps } from "~/components/cards/music-item-card/type";
import { DateUtils } from "~/lib/date-utils";

// import {
// 	unstable_cacheLife as cacheLife,
// 	unstable_cacheTag as cacheTag,
// } from "next/cache";

type MonthlyTrack = {
	month: string;
	spotifyId: string;
	msPlayed: bigint;
	count: bigint;
	rank: number;
};

type Trend = "up" | "down" | "same" | "new";

export type MonthlyTrends = {
	month: string;
	tracks: Array<
		MusicItemCardProps["item"] & {
			rank: number;
			trend?: Trend;
			previousRank?: number;
		}
	>;
};

export type ChartRace = {
	name: string;
	color: string;
	data: Array<{ month: string; rank: number | null; image?: string | null }>;
};

export const getMonthlyTracksTabData = async (
	artistId: string,
	userId: string,
) => {
	// "use cache";
	// cacheLife("days");_artistId_userId
	// cacheTag(userId, "artist-detail", "monthly-tracks-tab");

	const monthlyTracks = await getMonthlyTracks(artistId, userId);
	if (monthlyTracks.length === 0) return { monthlyTrends: [], chartRace: [] };

	const groupedByMonth = _.groupBy(monthlyTracks, (t) => t.month);

	const sortedMonths = Object.keys(groupedByMonth).sort((a, b) => {
		const aIdx = DateUtils.getMonthIndex(a);
		const bIdx = DateUtils.getMonthIndex(b);
		return (
			aIdx.year * 12 + aIdx.monthIndex - (bIdx.year * 12 + bIdx.monthIndex)
		);
	});
	const allMonths = DateUtils.generateMonthRange(
		DateUtils.getMonthIndex(sortedMonths[0]),
		DateUtils.getMonthIndex(sortedMonths[sortedMonths.length - 1]),
	);

	const trendMap = computeTrendsPerMonth(monthlyTracks, allMonths);

	const uniqueIds = _.uniq(monthlyTracks.map((t) => t.spotifyId));
	const trackDetails = await getSpotifyTrackDetails(userId, uniqueIds);

	const monthlyTrends = buildMonthlyTrendsData(
		allMonths,
		groupedByMonth,
		trendMap,
		trackDetails,
	);
	const chartRace = buildChartRaceData(monthlyTrends);

	return {
		monthlyTrends,
		chartRace,
	};
};

const getMonthlyTracks = async (artistId: string, userId: string) => {
	return await db.execute<MonthlyTrack>(sql`
        WITH monthly_tracks AS (
          SELECT
            TO_CHAR("timestamp", 'FMMonth YYYY') AS month,
            EXTRACT(YEAR FROM "timestamp") AS year,
            EXTRACT(MONTH FROM "timestamp") AS month_num,
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
        WHERE rank <= 5
        ORDER BY
          TO_DATE(month, 'Month YYYY') DESC,
          rank ASC
      `);
};

const computeTrendsPerMonth = (stats: MonthlyTrack[], allMonths: string[]) => {
	const byMonth = _.groupBy(stats, (s) => s.month);
	const trendMap: Record<
		string,
		Record<string, { previousRank?: number; trend: Trend }>
	> = {};

	for (let i = 0; i < allMonths.length; i++) {
		const month = allMonths[i];
		const prevMonth = allMonths[i - 1];
		const currentTracks = byMonth[month] ?? [];
		const previousTracks = byMonth[prevMonth] ?? [];

		const previousRankMap = Object.fromEntries(
			previousTracks.map((t) => [t.spotifyId, t.rank]),
		);

		trendMap[month] = {};
		for (const track of currentTracks) {
			const prevRank = previousRankMap[track.spotifyId];
			let trend: Trend = "new";
			if (prevRank !== undefined) {
				trend =
					prevRank > track.rank
						? "up"
						: prevRank < track.rank
							? "down"
							: "same";
			}
			trendMap[month][track.spotifyId] = {
				previousRank: prevRank,
				trend,
			};
		}
	}
	return trendMap;
};

const getSpotifyTrackDetails = async (userId: string, trackIds: string[]) => {
	try {
		spotify.setUserId(userId);
		const tracks = await spotify.tracks.list(trackIds);
		return Object.fromEntries(tracks.map((t) => [t.id, t]));
	} catch (e) {
		console.error("Spotify fetch failed", e);
		return {};
	}
};

const buildMonthlyTrendsData = (
	months: string[],
	grouped: Record<string, MonthlyTrack[]>,
	trends: Record<
		string,
		Record<string, { previousRank?: number; trend: Trend }>
	>,
	trackDetails: Record<string, Track>,
): MonthlyTrends[] =>
	months
		.slice()
		.reverse()
		.map((month) => ({
			month,
			tracks: (grouped[month] ?? []).map((track) => {
				const detail = trackDetails[track.spotifyId];
				const trendData = trends[month]?.[track.spotifyId] ?? {};
				return {
					href: detail?.external_urls?.spotify,
					id: track.spotifyId,
					name: detail?.name || `Unknown (${track.spotifyId.slice(0, 6)})`,
					image: detail?.album?.images?.[0]?.url,
					artists: detail?.album?.name || "Unknown",
					stat1: `${DateUtils.msToMinutes(Number(track.msPlayed)).toFixed(2)} min`,
					stat2: `${Number(track.count)} plays`,
					rank: track.rank,
					trend: trendData?.trend,
					previousRank: trendData?.previousRank,
				};
			}),
		}));

const buildChartRaceData = (data: MonthlyTrends[]): ChartRace[] => {
	const trackNames = _.uniq(data.flatMap((d) => d.tracks.map((t) => t.name)));
	const raceMap = Object.fromEntries(
		trackNames.map((name) => [
			name,
			{
				name,
				color: stringToColor(name),
				data: [] as ChartRace["data"],
			},
		]),
	);

	for (const { month, tracks } of data) {
		const map = Object.fromEntries(tracks.map((t) => [t.name, t]));
		for (const name of trackNames) {
			const entry = map[name];
			raceMap[name].data.push({
				month,
				rank: entry?.rank,
				image: entry?.image ?? null,
			});
		}
	}

	return Object.values(raceMap);
};

const stringToColor = (str: string) => {
	let hash = 0;
	for (let i = 0; i < str.length; i++)
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	const color = (hash & 0xffffff).toString(16).padStart(6, "0");
	return `#${color}`;
};
