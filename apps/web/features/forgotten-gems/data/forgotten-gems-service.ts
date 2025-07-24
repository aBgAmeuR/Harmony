"use server";

import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

import { and, auth, count, db, gte, lte, sql, tracks } from "@repo/database";
import { spotify } from "@repo/spotify";
import type { Track } from "@repo/spotify/types";

import type { ForgottenGem } from "../types";

type TrackYearStats = {
	spotifyId: string;
	year: number;
	playCount: number;
	totalTime: bigint;
};

export const getForgottenGems = async (
	userId: string,
): Promise<ForgottenGem[]> => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "forgotten-gems");

	const currentYear = new Date().getFullYear();

	const [percentileMap, trackYearStats] = await Promise.all([
		getPercentiles(userId),
		getTrackYearStats(userId),
	]);

	const filtered = trackYearStats.filter((stat) => {
		if (stat.year === currentYear) return false;

		const playedInLaterYear = trackYearStats.some(
			(s) =>
				s.spotifyId === stat.spotifyId &&
				s.year > stat.year &&
				s.year <= currentYear,
		);
		if (playedInLaterYear) return false;

		const perc = percentileMap.get(stat.year);
		if (perc && (stat.playCount < perc.p5 || stat.playCount > perc.p20))
			return false;

		return true;
	});

	const grouped = filtered.reduce((acc, stat) => {
		const yearGroup = acc.get(stat.year) ?? [];
		yearGroup.push(stat);
		acc.set(stat.year, yearGroup);
		return acc;
	}, new Map<number, TrackYearStats[]>());

	const selectedStats: TrackYearStats[] = [];
	for (const [_, group] of grouped.entries()) {
		const sortedGroup = group
			.sort((a, b) => Number(b.totalTime) - Number(a.totalTime))
			.slice(0, 50);
		selectedStats.push(...sortedGroup);
	}

	const uniqueIds = [...new Set(selectedStats.map((s) => s.spotifyId))];
	spotify.setUserId(userId);
	const trackDetails = await spotify.tracks.list(uniqueIds);
	const trackMap = new Map(trackDetails.map((t: Track) => [t.id, t]));

	const gems: ForgottenGem[] = selectedStats
		.map((stat) => {
			const track = trackMap.get(stat.spotifyId);
			if (!track) return null;
			const msPlayed = Number(stat.totalTime);

			return {
				id: stat.spotifyId,
				name: track.name,
				href: track.external_urls.spotify,
				image: track.album.images[0]?.url,
				artists: track.artists.map((a) => a.name).join(", "),
				stat1: `${stat.playCount} plays`,
				stat2: `${Math.round(msPlayed / 1000 / 60)} min`,
				msPlayed,
				playCount: stat.playCount,
				year: stat.year,
			};
		})
		.filter(Boolean) as ForgottenGem[];

	gems.sort((a, b) => b.year - a.year);

	return gems;
};

async function getPercentiles(userId: string) {
	const playCounts = db.$with("play_counts").as(
		db
			.select({
				year: sql<number>`EXTRACT(YEAR FROM ${tracks.timestamp})`.as("year"),
				spotifyId: tracks.spotifyId,
				playCount: count().as("play_count"),
			})
			.from(tracks)
			.where(auth(userId))
			.groupBy(sql`year`, tracks.spotifyId),
	);

	const percentiles = await db
		.with(playCounts)
		.select({
			year: playCounts.year,
			p5: sql<number>`PERCENTILE_CONT(0.05) WITHIN GROUP (ORDER BY ${playCounts.playCount})`,
			p20: sql<number>`PERCENTILE_CONT(0.20) WITHIN GROUP (ORDER BY ${playCounts.playCount})`,
		})
		.from(playCounts)
		.groupBy(playCounts.year);

	return new Map(percentiles.map((p) => [p.year, { p5: p.p5, p20: p.p20 }]));
}

async function getTrackYearStats(userId: string): Promise<TrackYearStats[]> {
	const results = await db
		.select({
			spotifyId: tracks.spotifyId,
			year: sql<number>`EXTRACT(YEAR FROM ${tracks.timestamp})`,
			playCount: count(),
			totalTime: sql<bigint>`SUM(${tracks.msPlayed})`,
		})
		.from(tracks)
		.where(auth(userId))
		.groupBy(({ year }) => [tracks.spotifyId, year])
		.having(({ playCount }) => and(gte(playCount, 10), lte(playCount, 100)));

	return results.map((result) => ({
		spotifyId: result.spotifyId,
		year: Number(result.year),
		playCount: result.playCount,
		totalTime: result.totalTime,
	}));
}
