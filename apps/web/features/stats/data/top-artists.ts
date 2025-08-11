"server-only";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { and, db, desc, eq, historicalArtistRankings } from "@repo/database";
import { spotify } from "@repo/spotify";

import { getRankChange, getTimeRangeStats } from "./utils";

const formatFollowers = (followers: number) => {
	if (followers >= 1_000_000) return `${(followers / 1_000_000).toFixed(1)}M`;
	if (followers >= 1_000) return `${(followers / 1_000).toFixed(1)}k`;
	return followers.toString();
};

export const getTopArtists = async (userId: string, isDemo: boolean) => {
	"use cache";
	cacheLife("hours");
	cacheTag(`top-artists-${userId}`);

	const timeRange = await getTimeRangeStats(userId, isDemo);
	spotify.setUserId(userId);

	const [previousRankings, artists] = await Promise.all([
		db
			.select({
				artistId: historicalArtistRankings.artistId,
				rank: historicalArtistRankings.rank,
			})
			.from(historicalArtistRankings)
			.where(
				and(
					eq(historicalArtistRankings.userId, userId),
					eq(historicalArtistRankings.timeRange, timeRange),
				),
			)
			.orderBy(desc(historicalArtistRankings.timestamp))
			.limit(50),
		spotify.me.top("artists", timeRange),
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
