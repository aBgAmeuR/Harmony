"use server";

import { prisma } from "@repo/database";
import { spotify } from "@repo/spotify";
import type { Album } from "@repo/spotify/types";

export async function getAlbumDetails(albumId: string): Promise<Album | null> {
	try {
		// Try to get from Spotify API
		const albums = await spotify.albums.list([albumId]);
		return albums[0] || null;
	} catch (error) {
		console.error("Error fetching album details:", error);
		return null;
	}
}

export async function getAlbumListeningStats(
	userId: string | undefined,
	albumId: string,
) {
	if (!userId) {
		return null;
	}

	try {
		// 1. Statistiques globales
		const [global] = await prisma.$queryRaw<
			[
				{
					totalplays: number;
					totalminutes: number;
					firstlisten: Date | null;
					lastlisten: Date | null;
				},
			]
		>`
			SELECT
				COUNT(*) AS totalplays,
				ROUND(SUM("msPlayed")::numeric / 1000 / 60) AS totalminutes,
				MIN("timestamp") AS firstlisten,
				MAX("timestamp") AS lastlisten
			FROM "Track"
			WHERE "userId" = ${userId} AND "albumId" = ${albumId}
		`;

		// 2. Piste favorite
		const [fav] = await prisma.$queryRaw<
			[
				{
					spotifyid: string;
					plays: number;
				},
			]
		>`
			SELECT "spotifyId" as spotifyid, COUNT(*) as plays
			FROM "Track"
			WHERE "userId" = ${userId} AND "albumId" = ${albumId}
			GROUP BY "spotifyId"
			ORDER BY plays DESC
			LIMIT 1
		`;

		// 3. Tendance mensuelle
		const monthly = await prisma.$queryRaw<
			{
				month: string;
				plays: number;
			}[]
		>`
			SELECT TO_CHAR("timestamp", 'YYYY-MM') as month, COUNT(*) as plays
			FROM "Track"
			WHERE "userId" = ${userId} AND "albumId" = ${albumId}
			AND "timestamp" > NOW() - INTERVAL '6 months'
			GROUP BY month
			ORDER BY month ASC
		`;

		return {
			totalPlays: Number(global?.totalplays ?? 0),
			totalMinutes: Number(global?.totalminutes ?? 0),
			firstListen: global?.firstlisten ?? null,
			lastListen: global?.lastlisten ?? null,
			avgCompletion: 85, // TODO: calculer si pertinent
			favoriteTrack: fav
				? {
						id: fav.spotifyid,
						name: "Track", // Pour un vrai nom, requête Spotify API
						plays: Number(fav.plays),
					}
				: null,
			monthlyTrend: monthly.map((m) => ({
				month: new Date(`${m.month}-01`).toLocaleDateString("en-US", {
					month: "short",
				}),
				plays: Number(m.plays),
			})),
		};
	} catch (error) {
		console.error("Error fetching album stats:", error);
		return null;
	}
}

export async function getAlbumTracks(albumId: string) {
	try {
		const album = await getAlbumDetails(albumId);
		return album?.tracks.items || [];
	} catch (error) {
		console.error("Error fetching album tracks:", error);
		return [];
	}
}
