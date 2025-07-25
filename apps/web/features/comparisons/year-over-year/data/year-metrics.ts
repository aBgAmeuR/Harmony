import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { auth, count, db, desc, sql, sum, tracks } from "@repo/database";
import { spotify } from "@repo/spotify";
import type { Artist, Track } from "@repo/spotify/types";

export interface YearMetrics {
	year: number;
	totalListeningTime: number;
	numStreams: number;
	topArtists: { id: string; name: string; image?: string; plays: number }[];
	topTracks: {
		id: string;
		name: string;
		artists: string[];
		image?: string;
		plays: number;
	}[];
	monthly: { month: string; listeningTime: number; streams: number }[];
}

export async function getYearMetrics(
	userId: string,
	year: number,
	limit = 5,
): Promise<YearMetrics> {
	"use cache";
	cacheLife("days");
	cacheTag(userId, `year-metrics-${year}`);

	const whereClause = auth(userId, {
		monthRange: {
			dateStart: new Date(year, 0, 1),
			dateEnd: new Date(year + 1, 0, 1),
		},
	});

	const [totals, topArtistsRaw, topTracksRaw, monthlyRaw] = await Promise.all([
		db
			.select({ streams: count(), time: sum(tracks.msPlayed) })
			.from(tracks)
			.where(whereClause),
		db
			.select({
				artistIds: tracks.artistIds,
				plays: count(),
				time: sum(tracks.msPlayed),
			})
			.from(tracks)
			.where(whereClause)
			.groupBy(tracks.artistIds)
			.orderBy(({ time }) => desc(time))
			.limit(limit * 2),
		db
			.select({
				trackId: tracks.spotifyId,
				plays: count(),
				time: sum(tracks.msPlayed),
			})
			.from(tracks)
			.where(whereClause)
			.groupBy(tracks.spotifyId)
			.orderBy(({ plays }) => desc(plays))
			.limit(limit),
		db
			.select({
				month: sql<string>`TO_CHAR(${tracks.timestamp}, 'Month')`,
				streams: count(),
				time: sum(tracks.msPlayed),
			})
			.from(tracks)
			.where(whereClause)
			.groupBy(({ month }) => month)
			.orderBy(({ month }) => month),
	]);

	const totalListeningTime = Number(totals[0]?.time ?? 0);
	const numStreams = totals[0]?.streams ?? 0;

	const aggregatedArtists: Record<string, { plays: number; time: number }> = {};
	topArtistsRaw.forEach((entry) => {
		entry.artistIds.forEach((artistId) => {
			aggregatedArtists[artistId] ??= { plays: 0, time: 0 };
			aggregatedArtists[artistId].plays += entry.plays;
			aggregatedArtists[artistId].time += Number(entry.time ?? 0);
		});
	});
	const sortedArtists = Object.entries(aggregatedArtists)
		.map(([artistId, data]) => ({ artistId, ...data }))
		.sort((a, b) => b.time - a.time)
		.slice(0, limit);

	spotify.setUserId(userId);
	const artistsInfo = await spotify.artists.list(
		sortedArtists.map((a) => a.artistId),
	);
	const topArtists = sortedArtists.map((a) => {
		const info = artistsInfo.find((i: Artist) => i.id === a.artistId);
		return {
			id: a.artistId,
			name: info?.name ?? "",
			image: info?.images?.[0]?.url,
			plays: a.plays,
		};
	});

	const tracksInfo = await spotify.tracks.list(
		topTracksRaw.map((t) => t.trackId),
	);
	const topTracks = topTracksRaw.map((t) => {
		const info = tracksInfo.find((i: Track) => i.id === t.trackId);
		return {
			id: t.trackId,
			name: info?.name ?? "",
			artists: info?.artists.map((ar) => ar.name) ?? [],
			image: info?.album.images?.[0]?.url,
			plays: t.plays,
		};
	});

	const monthly = monthlyRaw.map((m) => ({
		month: m.month,
		listeningTime: Number(m.time ?? 0),
		streams: m.streams,
	}));

	return {
		year,
		totalListeningTime,
		numStreams,
		topArtists,
		topTracks,
		monthly,
	};
}
