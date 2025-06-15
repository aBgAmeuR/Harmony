"server-only";

import { prisma } from "@repo/database";
import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";
import { getMonthRange } from "~/lib/dal";
import { formatMonth } from "~/lib/utils";

export const getTimeEvolutionData = async (userId: string, isDemo: boolean) => {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "time-evolution");

	const monthRange = await getMonthRange(userId, isDemo);

	const firstPlays = await prisma.track.findMany({
		where: { userId },
		orderBy: { timestamp: "asc" },
		distinct: ["spotifyId", "userId"],
		select: {
			timestamp: true,
			spotifyId: true,
			albumId: true,
			artistIds: true,
		},
	});

	if (firstPlays.length === 0) return null;

	const tracksData = aggregateData(firstPlays, (track) =>
		formatMonth(new Date(track.timestamp)),
	);

	const albumsData = aggregateData(
		Object.values(
			firstPlays.reduce<Record<string, { timestamp: Date; albumId: string }>>(
				(acc, play) => {
					if (!acc[play.albumId]) acc[play.albumId] = play;
					return acc;
				},
				{},
			),
		),
		(play) => formatMonth(new Date(play.timestamp)),
	);

	const artistsData = aggregateData(
		Object.values(
			firstPlays.reduce<
				Record<string, { timestamp: Date; artistIds: string[] }>
			>((acc, play) => {
				const key = play.artistIds.join(",");
				if (!acc[key]) acc[key] = play;
				return acc;
			}, {}),
		),
		(play) => formatMonth(new Date(play.timestamp)),
	);

	const filterData = (
		data: Array<{ key: string; value: number }>,
		monthRange: { dateStart: Date; dateEnd: Date },
	) =>
		data.filter((item) => {
			const date = new Date(item.key);
			return date >= monthRange.dateStart && date < monthRange.dateEnd;
		});

	return {
		tracks: {
			data: filterData(tracksData, monthRange).map((item) => ({
				month: item.key,
				value: item.value,
			})),
			totalUniqueFirstPlays: tracksData[tracksData.length - 1].value,
		},
		albums: {
			data: filterData(albumsData, monthRange).map((item) => ({
				month: item.key,
				value: item.value,
			})),
			totalUniqueFirstPlays: albumsData[albumsData.length - 1].value,
		},
		artists: {
			data: filterData(artistsData, monthRange).map((item) => ({
				month: item.key,
				value: item.value,
			})),
			totalUniqueFirstPlays: artistsData[artistsData.length - 1].value,
		},
	};
};

const aggregateData = (
	items: Array<{ timestamp: Date }>,
	keyExtractor: (item: { timestamp: Date }) => string,
) => {
	const aggregated = items.reduce<Record<string, number>>((acc, item) => {
		const key = keyExtractor(item);
		acc[key] = (acc[key] || 0) + 1;
		return acc;
	}, {});

	const result = Object.entries(aggregated).map(([key, value]) => ({
		key,
		value,
	}));

	for (let i = 1; i < result.length; i++) {
		result[i].value += result[i - 1].value;
	}

	return result;
};
