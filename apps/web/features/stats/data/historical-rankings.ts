"server-only";

import {
	and,
	db,
	eq,
	historicalArtistRankings,
	historicalTrackRankings,
} from "@repo/database";
import { SpotifyAPI } from "@repo/spotify";

import { getTimeRangeStats } from "~/features/stats/data/utils";
import { DateUtils } from "~/lib/date-utils";

const fillHistoricalWeeklyTimeline = (
	data: { timestamp: Date; rank: number }[],
) => {
	if (data.length === 0) return [];

	const sortedData = [...data].sort(
		(a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
	);

	const minDate = sortedData[0].timestamp;
	const maxDate = DateUtils.getLastDayOfWeek(
		DateUtils.getWeek(new Date(Date.now())) === 1
			? 52
			: DateUtils.getWeek(new Date(Date.now())) - 1,
		new Date(Date.now()).getFullYear(),
	);

	const dataMap = new Map(
		sortedData.map((item) => [
			DateUtils.formatDate(item.timestamp, "full"),
			item.rank,
		]),
	);

	const filledData = [];
	const minWeek = DateUtils.getWeek(minDate);
	const maxWeek = DateUtils.getWeek(maxDate);
	const minYear = minDate.getFullYear();
	const maxYear = maxDate.getFullYear();

	let currentYear = minYear;
	let currentWeek = minWeek;

	while (
		currentYear < maxYear ||
		(currentYear === maxYear && currentWeek <= maxWeek)
	) {
		const lastDayOfWeek = DateUtils.getLastDayOfWeek(currentWeek, currentYear);
		const formattedDate = DateUtils.formatDate(lastDayOfWeek, "full");
		const rank = dataMap.get(formattedDate) ?? null;

		filledData.push({
			timestamp: formattedDate,
			rank,
		});

		currentWeek++;

		if (currentWeek > 53) {
			currentWeek = 1;
			currentYear++;
		}

		if (lastDayOfWeek > maxDate) {
			break;
		}
	}

	return filledData;
};

export async function getHistoricalTrackRankings(
	userId: string,
	isDemo: boolean,
	trackId: string,
) {
	const timeRangeStats = await getTimeRangeStats(userId, isDemo);
	if (!timeRangeStats) return [];

	const results = await db
		.select({
			timestamp: historicalTrackRankings.timestamp,
			rank: historicalTrackRankings.rank,
		})
		.from(historicalTrackRankings)
		.where(
			and(
				eq(historicalTrackRankings.userId, userId),
				eq(historicalTrackRankings.trackId, trackId),
				eq(historicalTrackRankings.timeRange, timeRangeStats),
			),
		)
		.orderBy(historicalTrackRankings.timestamp);

	return fillHistoricalWeeklyTimeline(results);
}

export async function getHistoricalArtistRankings(
	userId: string,
	isDemo: boolean,
	artistId: string,
) {
	const timeRangeStats = await getTimeRangeStats(userId, isDemo);
	if (!timeRangeStats) return [];

	const results = await db
		.select({
			timestamp: historicalArtistRankings.timestamp,
			rank: historicalArtistRankings.rank,
		})
		.from(historicalArtistRankings)
		.where(
			and(
				eq(historicalArtistRankings.userId, userId),
				eq(historicalArtistRankings.artistId, artistId),
				eq(historicalArtistRankings.timeRange, timeRangeStats),
			),
		)
		.orderBy(historicalArtistRankings.timestamp);

	return fillHistoricalWeeklyTimeline(results);
}

export async function updateHistoricalRankings(userId: string) {
	try {
		const timeRanges = ["short_term", "medium_term", "long_term"] as const;
		const allTrackRankings = [];
		const allArtistRankings = [];

		const spotify = new SpotifyAPI({
			clientId: process.env.AUTH_SPOTIFY_ID || "missing",
			clientSecret: process.env.AUTH_SPOTIFY_SECRET || "missing",
			debug: true,
			userId,
		});

		for (const timeRange of timeRanges) {
			const topTracks = await spotify.me.top("tracks", timeRange);
			const topArtists = await spotify.me.top("artists", timeRange);

			const trackRankings = topTracks.map((track, index) => ({
				userId,
				trackId: track.id,
				rank: index + 1,
				timeRange,
			}));

			const artistRankings = topArtists.map((artist, index) => ({
				userId,
				artistId: artist.id,
				rank: index + 1,
				timeRange,
			}));

			allTrackRankings.push(...trackRankings);
			allArtistRankings.push(...artistRankings);
		}

		await Promise.all([
			db.insert(historicalTrackRankings).values(allTrackRankings),
			db.insert(historicalArtistRankings).values(allArtistRankings),
		]);
	} catch (error) {
		console.error(error);
	}
}
