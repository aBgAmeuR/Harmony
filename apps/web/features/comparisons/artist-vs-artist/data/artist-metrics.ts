"server-only";

import { and, auth, count, db, desc, sql, sum, tracks } from "@repo/database";

import { DateUtils } from "~/lib/date-utils";

export interface ArtistMetrics {
	total: { streams: number; listeningTime: number };
	topTracks: { trackId: string; plays: number; time: number }[];
	topAlbums: { albumId: string; plays: number; time: number }[];
	monthly: { month: string; listeningTime: number; streams: number }[];
	unique: { tracks: number; albums: number };
}

export async function getArtistMetrics(
	userId: string,
	artistId: string,
	limit = 5,
): Promise<ArtistMetrics> {
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
				.where(whereClause)
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

	const topTracks = topTracksRaw.map(({ trackId, plays, time }) => ({
		trackId,
		plays,
		time: Number(time) ?? 0,
	}));

	const topAlbums = topAlbumsRaw.map(({ albumId, plays, time }) => ({
		albumId,
		plays,
		time: Number(time) ?? 0,
	}));

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
		total: { streams: numStreams, listeningTime: totalListeningTime },
		topTracks,
		topAlbums,
		monthly,
		unique: {
			tracks: Number(unique[0]?.uniqueTracks ?? 0),
			albums: Number(unique[0]?.uniqueAlbums ?? 0),
		},
	};
}
