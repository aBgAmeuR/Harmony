"use server";

import { getUser } from "@repo/auth";

import {
	getHistoricalArtistRankings,
	getHistoricalTrackRankings,
} from "../data/historical-rankings";

export async function getHistoricalTrackRankingsAction(trackId: string) {
	const { userId, isDemo } = await getUser();

	return getHistoricalTrackRankings(userId, isDemo, trackId);
}

export async function getHistoricalArtistRankingsAction(artistId: string) {
	const { userId, isDemo } = await getUser();

	return getHistoricalArtistRankings(userId, isDemo, artistId);
}
