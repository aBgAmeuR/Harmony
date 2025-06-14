"server-only";

import { db, eq, users } from "@repo/database";
import { spotify } from "@repo/spotify";

import { getMsPlayedInMinutes } from "~/lib/utils";

export const getTimeRangeStats = async (userId: string) => {
	return await db.query.users.findFirst({
		where: eq(users.id, userId),
		columns: { timeRangeStats: true },
	});
};

const formatFollowers = (followers: number) => {
	if (followers >= 1_000_000) return `${(followers / 1_000_000).toFixed(1)}M`;
	if (followers >= 1_000) return `${(followers / 1_000).toFixed(1)}k`;
	return followers.toString();
};

const getRankChange = (
	previousRank: number | undefined,
	currentRank: number,
): "up" | "down" | "new" | undefined => {
	if (previousRank === undefined) return "new";
	if (previousRank > currentRank) return "up";
	if (previousRank < currentRank) return "down";
	return undefined;
};

export const getTopArtists = async (userId: string | undefined) => {
	if (!userId) return null;

	const timeRangeStats = await getTimeRangeStats(userId);
	if (!timeRangeStats) return null;

	const [previousRankings, artists] = await Promise.all([
		prisma.historicalArtistRanking.findMany({
			where: {
				userId,
				timeRange: timeRangeStats.timeRangeStats,
			},
			orderBy: { timestamp: "asc" },
			select: {
				artistId: true,
				rank: true,
			},
			take: 50,
		}),
		spotify.me.top("artists", timeRangeStats.timeRangeStats),
	]);

	return artists.map((artist, index) => {
		const previous = previousRankings.find((r) => r.artistId === artist.id);
		const rankChange = getRankChange(previous?.rank, index + 1);
		return {
			id: artist.id,
			image: artist.images[0].url,
			name: artist.name,
			href: artist.external_urls.spotify,
			artists: artist.genres.join(", "),
			stat1: `${artist.popularity}% popularity`,
			stat2: `${formatFollowers(artist.followers.total)} followers`,
			rankChange,
		};
	});
};

export const getTopTracks = async (userId: string | undefined) => {
	if (!userId) return null;

	const timeRangeStats = await getTimeRangeStats(userId);
	if (!timeRangeStats) return null;

	const [previousRankings, tracks] = await Promise.all([
		prisma.historicalTrackRanking.findMany({
			where: {
				userId,
				timeRange: timeRangeStats.timeRangeStats,
			},
			orderBy: { timestamp: "asc" },
			select: {
				trackId: true,
				rank: true,
			},
			take: 50,
		}),
		spotify.me.top("tracks", timeRangeStats.timeRangeStats),
	]);

	return tracks.map((track, index) => {
		const previous = previousRankings.find((r) => r.trackId === track.id);
		const rankChange = getRankChange(previous?.rank, index + 1);
		return {
			id: track.id,
			image: track.album.images[0].url,
			name: track.name,
			href: track.external_urls.spotify,
			artists: track.artists.map((artist) => artist.name).join(", "),
			stat1: `${track.popularity}% popularity`,
			stat2: `${getMsPlayedInMinutes(track.duration_ms)} minutes`,
			rankChange,
		};
	});
};
