"server-only";

import { and, db, desc, eq, gte, lt, sql, tracks } from "@repo/database";
import { spotify } from "@repo/spotify";

import { getMonthRangeAction } from "~/actions/month-range-actions";
import { getMsPlayedInMinutes } from "~/lib/utils";

export const getRankingTracks = async (userId: string | undefined) => {
	if (!userId) return null;

	const monthRange = await getMonthRangeAction();
	if (!monthRange) return null;

	const topTracks = await db
		.select({
			spotifyId: tracks.spotifyId,
			count: sql<number>`count(*)`,
			sum: sql<number>`sum(${tracks.msPlayed})`,
		})
		.from(tracks)
		.where(
			and(
				eq(tracks.userId, userId),
				gte(tracks.timestamp, monthRange.dateStart!),
				lt(tracks.timestamp, monthRange.dateEnd!),
			),
		)
		.groupBy(tracks.spotifyId)
		.orderBy(desc(sql`sum(${tracks.msPlayed})`))
		.limit(50);

	const tracksInfos = await spotify.tracks.list(
		topTracks.map((track) => track.spotifyId),
	);

	return tracksInfos.map((track) => {
		const topTrack = topTracks.find(
			(topTrack) => topTrack.spotifyId === track.id,
		);
		const msPlayed = Number(topTrack?.sum) || 0;
		return {
			id: track.id,
			href: track.external_urls.spotify,
			image: track.album.images[0].url,
			name: track.name,
			artists: track.artists.map((artist) => artist.name).join(", "),
			stat1: `${getMsPlayedInMinutes(msPlayed)} minutes`,
			stat2: `${topTrack?.count || 0} streams`,
		};
	});
};

export const getRankingArtists = async (userId: string | undefined) => {
	if (!userId) return null;

	const monthRange = await getMonthRangeAction();
	if (!monthRange) return null;

	const topArtists = await db
		.select({
			artistIds: tracks.artistIds,
			count: sql<number>`count(*)`,
			sum: sql<number>`sum(${tracks.msPlayed})`,
		})
		.from(tracks)
		.where(
			and(
				eq(tracks.userId, userId),
				gte(tracks.timestamp, monthRange.dateStart!),
				lt(tracks.timestamp, monthRange.dateEnd!),
			),
		)
		.groupBy(tracks.artistIds)
		.orderBy(desc(sql`sum(${tracks.msPlayed})`));

	const aggregatedArtists: Record<
		string,
		{ totalMsPlayed: bigint; trackCount: number }
	> = {};

	topArtists.forEach((entry) => {
		entry.artistIds.forEach((artistId) => {
			if (!aggregatedArtists[artistId]) {
				aggregatedArtists[artistId] = {
					totalMsPlayed: BigInt(0),
					trackCount: 0,
				};
			}

			aggregatedArtists[artistId].totalMsPlayed +=
				BigInt(entry.sum) || BigInt(0);
			aggregatedArtists[artistId].trackCount += entry.count;
		});
	});

	const sortedArtists = Object.entries(aggregatedArtists)
		.map(([artistId, stats]) => ({
			artistId,
			totalMsPlayed: stats.totalMsPlayed,
			trackCount: stats.trackCount,
		}))
		.sort((a, b) => Number(b.totalMsPlayed - a.totalMsPlayed))
		.slice(0, 50);

	const artistsInfos = await spotify.artists.list(
		sortedArtists.map((artist) => artist.artistId),
	);

	return artistsInfos.map((artist) => {
		const topartist = sortedArtists.find(
			(topArtist) => topArtist.artistId === artist.id,
		);
		const msPlayed = Number(topartist?.totalMsPlayed) || 0;
		return {
			id: artist.id,
			href: artist.external_urls.spotify,
			image: artist.images[0]?.url,
			name: artist.name,
			stat1: `${getMsPlayedInMinutes(msPlayed)} minutes`,
			stat2: `${topartist?.trackCount || 0} streams`,
		};
	});
};

export const getRankingAlbums = async (userId: string | undefined) => {
	if (!userId) return null;

	const monthRange = await getMonthRangeAction();
	if (!monthRange) return null;

	const topAlbums = await db
		.select({
			albumId: tracks.albumId,
			count: sql<number>`count(*)`,
			sum: sql<number>`sum(${tracks.msPlayed})`,
		})
		.from(tracks)
		.where(
			and(
				eq(tracks.userId, userId),
				gte(tracks.timestamp, monthRange.dateStart!),
				lt(tracks.timestamp, monthRange.dateEnd!),
			),
		)
		.groupBy(tracks.albumId)
		.orderBy(desc(sql`sum(${tracks.msPlayed})`));

	const albumIds = topAlbums.map((album) => album.albumId);
	const albumsInfos = await spotify.albums.list(albumIds);

	return albumsInfos.map((album) => {
		const topAlbum = topAlbums.find(
			(topAlbum) => topAlbum.albumId === album.id,
		);
		const msPlayed = Number(topAlbum?.sum) || 0;
		return {
			id: album.id,
			href: album.external_urls.spotify,
			image: album.images[0].url,
			name: album.name || "Unknown album",
			artists: album.artists.map((artist) => artist.name).join(", "),
			stat1: `${getMsPlayedInMinutes(msPlayed)} minutes`,
			stat2: `${topAlbum?.count || 0} streams`,
		};
	});
};
