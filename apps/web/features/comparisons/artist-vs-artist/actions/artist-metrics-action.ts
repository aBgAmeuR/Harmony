"use server";

import { getUser } from "@repo/auth";

import { getArtistMetrics } from "../data/artist-metrics";

export async function getArtistMetricsAction(artistId: string) {
	const { userId } = await getUser();

	return getArtistMetrics(userId, artistId);
}
