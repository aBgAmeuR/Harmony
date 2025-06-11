"server-only";

import { prisma } from "@repo/database";
import { spotify } from "@repo/spotify";
import type { Track } from "@repo/spotify/types";
import { format, localeFormat } from "light-date";
import { cache } from "react";

type AlbumStats = {
	totalMinutes: number;
	totalStreams: number;
	monthlyAverageStreams: number;
	topMonth: {
		month: string;
		msPlayed: number;
	};
};

const formatMonth = (date: Date) =>
	`${localeFormat(date, "{MMMM}")} ${format(date, "{yyyy}")}`;

const formatDate = (date: Date) =>
	`${format(date, "{dd}")} ${localeFormat(date, "{MMMM}")} ${format(
		date,
		"{yyyy}",
	)}`;

export const getAlbumDetails = cache(async (albumId: string) => {
	try {
		return await spotify.albums.getAlbum(albumId);
	} catch (error) {
		return null;
	}
});

export async function getAlbumStats(
	userId: string | undefined,
	albumId: string,
): Promise<AlbumStats | null> {
	if (!userId) return null;

	try {
		const stats = await prisma.track.groupBy({
			by: ["albumId"],
			where: { userId, albumId },
			_count: true,
			_sum: { msPlayed: true },
		});

		if (!stats.length) return null;

		const totalMsPlayed = Number(stats[0]._sum.msPlayed) || 0;
		const totalStreams = stats[0]._count || 0;

		const monthly = await prisma.track.groupBy({
			by: ["albumId", "timestamp"],
			where: { userId, albumId },
			_sum: { msPlayed: true },
		});
		const monthlyMap: Record<string, number> = {};
		for (const row of monthly) {
			const date = row.timestamp as Date;
			const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
			monthlyMap[key] = (monthlyMap[key] || 0) + Number(row._sum.msPlayed || 0);
		}
		let bestMonth = "";
		let bestValue = 0;
		for (const [month, msPlayed] of Object.entries(monthlyMap)) {
			if (msPlayed > bestValue) {
				bestMonth = month;
				bestValue = msPlayed;
			}
		}

		let bestMonthLabel = "";
		if (bestMonth) {
			const [year, month] = bestMonth.split("-");
			bestMonthLabel = formatMonth(new Date(Number(year), Number(month) - 1));
		}

		const monthlyStats = await prisma.track.groupBy({
			by: ["albumId"],
			where: {
				userId,
				albumId,
				timestamp: {
					gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
				},
			},
			_count: true,
		});
		const monthlyStreams = monthlyStats[0]?._count || 0;

		return {
			totalMinutes: Number(Number(totalMsPlayed / 60000).toFixed(0)),
			totalStreams,
			monthlyAverageStreams: Math.round(monthlyStreams / 6),
			topMonth: {
				month: bestMonthLabel,
				msPlayed: Math.round(bestValue / 60000),
			},
		};
	} catch (error) {
		console.error("Failed to fetch album stats:", error);
		return null;
	}
}

export async function getAlbumTracks(
	userId: string | undefined,
	albumId: string,
) {
	if (!userId) return null;

	try {
		const album = await getAlbumDetails(albumId);
		if (!album) return null;

		const tracks = await spotify.albums.getTracks(albumId);
		const trackStats = await prisma.track.groupBy({
			by: ["spotifyId"],
			where: { userId, albumId },
			_count: true,
			_sum: { msPlayed: true },
		});

		return tracks.items.map((track: Track) => {
			const stats = trackStats.find((stat) => stat.spotifyId === track.id);
			const msPlayed = Number(stats?._sum.msPlayed) || 0;
			const plays = stats?._count || 0;

			return {
				id: track.id,
				name: track.name,
				image: album.images[0]?.url,
				spotifyUrl: track.external_urls.spotify,
				artists: track.artists
					.map((artist: { name: string }) => artist.name)
					.join(", "),
				album: album.name,
				plays,
				msPlayed,
				duration: track.duration_ms,
			};
		});
	} catch (error) {
		console.error("Failed to fetch album tracks:", error);
		return null;
	}
}

export async function getListeningTrends(userId: string, albumId: string) {
	const [monthlyTrends, timeDistribution, topDays] = await Promise.all([
		getAlbumMonthlyTrends(userId, albumId),
		getAlbumHourDistribution(userId, albumId),
		getAlbumTopDays(userId, albumId),
	]);

	return { monthlyTrends, timeDistribution, topDays };
}

async function getAlbumMonthlyTrends(userId: string, albumId: string) {
	const rows = await prisma.track.groupBy({
		by: ["albumId", "timestamp"],
		where: { userId, albumId },
		_sum: { msPlayed: true },
	});

	const dates = rows.map((row) => (row.timestamp as Date).getTime());
	if (dates.length === 0) return [];

	const minDate = new Date(Math.min(...dates));
	const maxDate = new Date(Math.max(...dates));

	const monthlyMap: Record<string, number> = {};
	const currentDate = new Date(minDate);
	while (currentDate <= maxDate) {
		monthlyMap[formatMonth(currentDate)] = 0;
		currentDate.setMonth(currentDate.getMonth() + 1);
	}

	for (const row of rows) {
		const date = row.timestamp as Date;
		const key = formatMonth(date);
		monthlyMap[key] = (monthlyMap[key] || 0) + Number(row._sum.msPlayed || 0);
	}

	return Object.entries(monthlyMap).map(([month, msPlayed]) => ({
		month,
		msPlayed: Number(msPlayed),
	}));
}

async function getAlbumHourDistribution(userId: string, albumId: string) {
	const listeningHabits = Array.from({ length: 24 }, (_, i) => ({
		hour: i,
		msPlayed: 0,
	}));

	const rows = await prisma.track.groupBy({
		by: ["albumId", "timestamp"],
		where: { userId, albumId },
		_sum: { msPlayed: true },
	});

	const hourMap: Record<number, number> = {};
	for (const row of rows) {
		const date = row.timestamp as Date;
		const hour = date.getHours();
		hourMap[hour] = (hourMap[hour] || 0) + Number(row._sum.msPlayed || 0);
	}

	return listeningHabits.map((habit) => ({
		hour: String(habit.hour),
		msPlayed: Number(hourMap[habit.hour] || 0),
	}));
}

async function getAlbumTopDays(userId: string, albumId: string) {
	const rows = await prisma.track.groupBy({
		by: ["albumId", "timestamp"],
		where: { userId, albumId },
		_sum: { msPlayed: true },
	});
	const dayMap: Record<string, number> = {};
	for (const row of rows) {
		const date = row.timestamp as Date;
		const key = formatDate(date);
		dayMap[key] = (dayMap[key] || 0) + Number(row._sum.msPlayed || 0);
	}
	return Object.entries(dayMap)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 10)
		.map(([date, msPlayed]) => ({ date, msPlayed: Number(msPlayed) }));
}

export async function getAlbumListeningStreaks(
	userId: string,
	albumId: string,
) {
	const rows = await prisma.track.groupBy({
		by: ["albumId", "timestamp"],
		where: { userId, albumId },
		_sum: { msPlayed: true },
	});
	const uniqueDays = Array.from(
		new Set(
			rows.map((row) => (row.timestamp as Date).toISOString().slice(0, 10)),
		),
	).sort();
	let maxStreak = 0;
	let currentStreak = 0;
	let prevDate: Date | null = null;
	for (const day of uniqueDays) {
		const date = new Date(day);
		if (prevDate && date.getTime() - prevDate.getTime() === 86400000) {
			currentStreak++;
		} else {
			currentStreak = 1;
		}
		maxStreak = Math.max(maxStreak, currentStreak);
		prevDate = date;
	}
	return { maxStreak, totalDays: uniqueDays.length };
}

export async function getAlbumFirstLastListen(userId: string, albumId: string) {
	const first = await prisma.track.findFirst({
		where: { userId, albumId },
		orderBy: { timestamp: "asc" },
		select: { timestamp: true },
	});
	const last = await prisma.track.findFirst({
		where: { userId, albumId },
		orderBy: { timestamp: "desc" },
		select: { timestamp: true },
	});
	return {
		firstListen: first?.timestamp ? formatDate(first.timestamp) : null,
		lastListen: last?.timestamp ? formatDate(last.timestamp) : null,
	};
}

// Tracks with stats for sorting
export async function getAlbumTracksWithStats(userId: string, albumId: string) {
	const album = await getAlbumDetails(albumId);
	if (!album) return [];
	const tracks = album.tracks.items;
	const stats = await prisma.track.groupBy({
		by: ["spotifyId"],
		where: { userId, albumId },
		_sum: { msPlayed: true },
		_count: { _all: true },
	});
	return tracks.map((track: any) => {
		const stat = stats.find((s) => s.spotifyId === track.id);
		return {
			index: track.track_number,
			id: track.id,
			name: track.name,
			artists: track.artists.map((a: any) => a.name).join(", "),
			image: album.images[0]?.url,
			msPlayed: stat ? Number(stat._sum.msPlayed) : 0,
			plays: stat ? stat._count._all : 0,
			spotifyUrl: track.external_urls.spotify,
		};
	});
}
