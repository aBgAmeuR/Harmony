"use server";

import { getUser } from "@repo/auth";
import { spotify } from "@repo/spotify";

export async function searchArtistsAction(query: string, limit: number = 10) {
	const { userId } = await getUser();

	spotify.setUserId(userId);
	return await spotify.artists.search(query, limit);
}
