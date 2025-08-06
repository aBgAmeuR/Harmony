"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { and, auth, count, db, desc, sql, sum, tracks } from "@repo/database";
import { spotify } from "@repo/spotify";

import { DateUtils } from "~/lib/date-utils";

import type { ComparisonMetrics } from "../../common/types";

export async function getArtistMetrics(
	userId: string,
	artistId: string,
	limit = 5,
): Promise<ComparisonMetrics | null> {
	"use cache";
	cacheLife("days");
	cacheTag(userId, `artist-metrics-${artistId}`);

	if (!artistId) return null;

	const whereClause = and(
		auth(userId),
		sql`${tracks.artistIds} @> ARRAY[${artistId}]::varchar[]`,
	);

	const [totals, topTracksRaw, topAlbumsRaw, monthlyRaw, unique] =
		await Promise.all([
			db
				.select({ streams: count(), time: sum(tracks.msPlayed) })
				.from(tracks)
				.where(whereClause),
			db
				.select({
					trackId: tracks.spotifyId,
					plays: count(),
					time: sum(tracks.msPlayed),
				})
				.from(tracks)
				.where(whereClause)
				.groupBy(tracks.spotifyId)
				.orderBy(({ time }) => desc(time))
				.limit(limit),
			db
				.select({
					albumId: tracks.albumId,
					plays: count(),
					time: sum(tracks.msPlayed),
				})
				.from(tracks)
				.where(
					and(
						auth(userId),
						sql`${tracks.albumArtistIds} @> ARRAY[${artistId}]::varchar[]`,
					),
				)
				.groupBy(tracks.albumId)
				.orderBy(({ time }) => desc(time))
				.limit(limit),
			db
				.select({
					month: sql<string>`TO_CHAR(${tracks.timestamp}, 'Month YYYY')`,
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
		]);

	const totalListeningTime = Number(totals[0]?.time ?? 0);
	const numStreams = totals[0]?.streams ?? 0;

	spotify.setUserId(userId);
	const [tracksInfo, albumsInfo] = await Promise.all([
		spotify.tracks.list(topTracksRaw.map((t) => t.trackId)),
		spotify.albums.list(topAlbumsRaw.map((a) => a.albumId)),
	]);

	const topTracks = topTracksRaw.map((t) => {
		const info = tracksInfo.find((i) => i.id === t.trackId);
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

	const topAlbums = topAlbumsRaw.map((a) => {
		const info = albumsInfo.find((i) => i.id === a.albumId);
		return {
			id: a.albumId,
			name: info?.name ?? "",
			artists: info?.artists.map((ar) => ar.name).join(", ") ?? "",
			image: info?.images?.[0]?.url ?? "",
			href: info?.external_urls.spotify ?? "",
			stat1: `${a.plays} plays`,
			stat2: `${(Number(a.time ?? 0) / 1000 / 60).toFixed(2)} min`,
		};
	});

	const monthly = monthlyRaw
		.map(({ month, streams, time }) => ({
			month: new Date(month),
			streams,
			listeningTime: Number(time) ?? 0,
		}))
		.sort((a, b) => a.month.getTime() - b.month.getTime())
		.map(({ month, streams, listeningTime }) => ({
			month: DateUtils.formatDate(month, "month-year"),
			streams,
			listeningTime,
		}));

	return {
		label: tracksInfo[0]?.artists[0]?.name ?? "",
		cards: {
			"Listening Time": Number(
				(totalListeningTime / 1000 / 60 / 60).toFixed(2),
			),
			"Total Streams": numStreams,
			"Unique Tracks": unique[0]?.uniqueTracks ?? 0,
			"Unique Albums": unique[0]?.uniqueAlbums ?? 0,
		},
		monthly,
		totalListeningTime: Number((totalListeningTime / 1000 / 60).toFixed(2)),
		totalStreams: numStreams,
		rank1: topTracks,
		rank2: topAlbums,
	};
}
