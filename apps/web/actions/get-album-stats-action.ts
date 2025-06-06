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
		// Get tracks listened from this album
		const tracks = await prisma.track.findMany({
			where: {
				userId: userId,
				albumId: albumId,
			},
			orderBy: {
				timestamp: "desc",
			},
		});

		// Calculate stats
		const totalPlays = tracks.length;
		const totalMs = tracks.reduce(
			(sum, track) => sum + Number(track.msPlayed),
			0,
		);
		const totalMinutes = Math.round(totalMs / 60000);

		// Get first and last listen
		const firstListen =
			tracks.length > 0 ? tracks[tracks.length - 1].timestamp : null;
		const lastListen = tracks.length > 0 ? tracks[0].timestamp : null;

		// Get most played track (simplified)
		const trackCounts = tracks.reduce(
			(acc, track) => {
				const id = track.spotifyId;
				acc[id] = (acc[id] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		const favoriteTrackId = Object.entries(trackCounts).sort(
			([, a], [, b]) => b - a,
		)[0]?.[0];

		// Create monthly trend (simplified)
		const monthlyTrend = tracks.reduce(
			(acc, track) => {
				const month = track.timestamp.toISOString().slice(0, 7); // YYYY-MM format
				acc[month] = (acc[month] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		const monthlyTrendArray = Object.entries(monthlyTrend)
			.sort(([a], [b]) => a.localeCompare(b))
			.slice(-6) // Last 6 months
			.map(([month, plays]) => ({
				month: new Date(`${month}-01`).toLocaleDateString("en-US", {
					month: "short",
				}),
				plays,
			}));

		return {
			totalPlays,
			totalMinutes,
			firstListen,
			lastListen,
			avgCompletion: 85, // Mock value for now
			favoriteTrack: favoriteTrackId
				? {
						id: favoriteTrackId,
						name: "Track", // Would need to get from Spotify API
						plays: trackCounts[favoriteTrackId],
					}
				: null,
			monthlyTrend: monthlyTrendArray,
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
