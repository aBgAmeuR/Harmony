"server-only";

import {
	and,
	arrayOverlaps,
	auth,
	count,
	db,
	desc,
	or,
	sql,
	sum,
	tracks,
} from "@repo/database";
import { spotify } from "@repo/spotify";
import type { Album, Track } from "@repo/spotify/types";

import { getMsPlayedInMinutes } from "~/lib/utils";

export const getCatalogTabData = async (artistId: string, userId: string) => {
	const topTracksQuery = db
		.select({
			spotifyId: tracks.spotifyId,
			msPlayed: sum(tracks.msPlayed),
			count: count(),
		})
		.from(tracks)
		.where(
			and(
				auth(userId),
				or(
					arrayOverlaps(tracks.artistIds, [artistId]),
					arrayOverlaps(tracks.albumArtistIds, [artistId]),
				),
			),
		)
		.groupBy(tracks.spotifyId)
		.orderBy(({ msPlayed }) => desc(msPlayed))
		.limit(30);

	const topAlbumsQuery = db
		.select({
			albumId: tracks.albumId,
			msPlayed: sum(tracks.msPlayed),
			count: count(),
		})
		.from(tracks)
		.where(and(auth(userId), arrayOverlaps(tracks.albumArtistIds, [artistId])))
		.groupBy(tracks.albumId)
		.having(sql<number>`COUNT(DISTINCT ${tracks.spotifyId}) >= 2`)
		.orderBy(({ msPlayed }) => desc(msPlayed))
		.limit(20);

	const [topTracks, topAlbums] = await Promise.all([
		topTracksQuery,
		topAlbumsQuery,
	]);

	const [tracksInfos, albumsInfos] = await Promise.all([
		spotify.tracks.list(topTracks.map((track) => track.spotifyId)),
		spotify.albums.list(topAlbums.map((album) => album.albumId)),
	]);

	const tracksData = tracksInfos.map((track) => {
		const findTrack = topTracks.find(
			(topTrack) => topTrack.spotifyId === track.id,
		);

		return formatItem(
			track,
			findTrack?.msPlayed ? BigInt(findTrack.msPlayed) : BigInt(0),
			findTrack?.count || 0,
			"track",
		);
	});

	const albumsData = (() => {
		const albumGroups: Record<
			string,
			{
				base: (typeof albumsInfos)[number];
				totalMs: bigint;
				totalCount: number;
			}
		> = {};
		for (const album of albumsInfos) {
			const key = album.name ?? "";
			const stats = topAlbums.find(
				(topAlbum) => topAlbum.albumId === album.id,
			) || { msPlayed: null, count: 0 };
			const statSum =
				stats.msPlayed !== null && stats.msPlayed !== undefined
					? BigInt(stats.msPlayed)
					: BigInt(0);
			if (!albumGroups[key]) {
				albumGroups[key] = {
					base: album,
					totalMs: statSum,
					totalCount: stats.count || 0,
				};
			} else {
				albumGroups[key].totalMs += statSum;
				albumGroups[key].totalCount += stats.count || 0;
			}
		}
		return Object.values(albumGroups).map(({ base, totalMs, totalCount }) => {
			return formatItem(base, totalMs, totalCount, "album");
		});
	})();

	return {
		tracks: tracksData,
		albums: albumsData,
	};
};

const formatItem = (
	item: Track | Album,
	sum: bigint | null,
	count: number | null,
	type: "track" | "album",
) => {
	const msPlayed = Number(sum) || 0;
	return {
		id: item.id,
		href: item.external_urls.spotify,
		image:
			type === "track"
				? (item as Track).album.images[0].url
				: (item as Album).images[0].url,
		name: item.name || `Unknown ${type}`,
		artists: item.artists.map((artist) => artist.name).join(", "),
		stat1: `${getMsPlayedInMinutes(msPlayed)} minutes`,
		stat2: `${count || 0} streams`,
	};
};
