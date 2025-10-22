import { cacheLife, cacheTag } from "next/cache";

import { auth, count, db, desc, sql, sum, tracks } from "@repo/database";
import { spotify } from "@repo/spotify";
import type { Artist, Track } from "@repo/spotify/types";

import { DateUtils } from "~/lib/date-utils";

import type { ComparisonMetrics } from "../../common/types";

export async function getYearMetrics(
	userId: string,
	year: number,
	limit = 5,
): Promise<ComparisonMetrics> {
	"use cache";
	cacheLife("days");
	cacheTag(userId, `year-metrics-${year}`);

	const whereClause = auth(userId, {
		monthRange: {
			dateStart: new Date(year, 0, 1),
			dateEnd: new Date(year + 1, 0, 1),
		},
	});

	const [
		totals,
		topArtistsRaw,
		topTracksRaw,
		monthlyRaw,
		uniqueCounts,
		uniqueArtistsRaw,
	] = await Promise.all([
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
		db
			.select({
				uniqueTracks: sql<number>`COUNT(DISTINCT ${tracks.spotifyId})`,
				uniqueAlbums: sql<number>`COUNT(DISTINCT ${tracks.albumId})`,
			})
			.from(tracks)
			.where(whereClause),
		db
			.select({
				uniqueArtists: sql<number>`COUNT(DISTINCT artist_id)`,
			})
			.from(
				sql`(SELECT unnest(${tracks.artistIds}) as artist_id FROM ${tracks} WHERE ${whereClause}) as artists_unnested`,
			),
	]);

	const totalListeningTime = Number(totals[0]?.time ?? 0);
	const numStreams = totals[0]?.streams ?? 0;
	const uniqueTracks = Number(uniqueCounts[0]?.uniqueTracks ?? 0);
	const uniqueArtists = Number(uniqueArtistsRaw[0]?.uniqueArtists ?? 0);
	const uniqueAlbums = Number(uniqueCounts[0]?.uniqueAlbums ?? 0);

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
	const [artistsInfo, tracksInfo] = await Promise.all([
		spotify.artists.list(sortedArtists.map((a) => a.artistId)),
		spotify.tracks.list(topTracksRaw.map((t) => t.trackId)),
	]);

	const topArtists = sortedArtists.map((a) => {
		const info = artistsInfo.find((i: Artist) => i.id === a.artistId);
		return {
			id: a.artistId,
			name: info?.name ?? "",
			image: info?.images?.[0]?.url ?? "",
			href: info?.external_urls.spotify ?? "",
			stat1: `${a.plays} plays`,
			stat2: `${(Number(a.time ?? 0) / 1000 / 60).toFixed(2)} min`,
		};
	});

	const topTracks = topTracksRaw.map((t) => {
		const info = tracksInfo.find((i: Track) => i.id === t.trackId);
		return {
			id: t.trackId,
			name: info?.name ?? "",
			artists: info?.artists.map((ar) => ar.name).join(", ") ?? "",
			image: info?.album.images?.[0]?.url ?? "",
			href: info?.external_urls.spotify ?? "",
			stat1: `${t.plays} plays`,
			stat2: `${(Number(t.time ?? 0) / 1000 / 60).toFixed(2)} min`,
		};
	});

	const monthlyMap = new Map(
		monthlyRaw.map((m) => [
			m.month.trim(),
			{
				listeningTime: Number(m.time ?? 0),
				streams: m.streams,
			},
		]),
	);

	const monthly = DateUtils.MONTHS.map((month) => ({
		month,
		...(monthlyMap.get(month) ?? { listeningTime: 0, streams: 0 }),
	}));

	return {
		label: year.toString(),
		cards: {
			"Listening Time": Number(
				(totalListeningTime / 1000 / 60 / 60).toFixed(2),
			),
			"Unique Tracks": uniqueTracks,
			"Unique Artists": uniqueArtists,
			"Unique Albums": uniqueAlbums,
		},
		monthly,
		totalListeningTime: Number((totalListeningTime / 1000 / 60).toFixed(2)),
		totalStreams: numStreams,
		rank1: topArtists,
		rank2: topTracks,
	};
}
