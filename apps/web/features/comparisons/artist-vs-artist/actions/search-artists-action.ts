"use server";

import { getUser } from "@repo/auth";
import { spotify } from "@repo/spotify";
import type { Artist } from "@repo/spotify/types";

export async function searchArtistsAction(
	query: string,
	limit: number = 10,
): Promise<Artist[]> {
	const { userId } = await getUser();
	spotify.setUserId(userId);
	return await spotify.artists.search(query, limit);
}
