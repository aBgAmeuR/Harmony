"use server";

import { getUser } from "@repo/auth";
import { spotify } from "@repo/spotify";
import type { Artist } from "@repo/spotify/types";

export async function getTopArtistsAction(): Promise<Artist[]> {
	const { userId } = await getUser();
	spotify.setUserId(userId);
	return (await spotify.me.top("artists", "medium_term")) as Artist[];
}
