"server-only";

import { cacheLife, cacheTag } from "next/cache";

import { spotify } from "@repo/spotify";

export async function getTopArtists(userId: string) {
	"use cache";
	cacheLife("days");
	cacheTag(userId, "top-artists-vs-artist");

	spotify.setUserId(userId);
	return await spotify.me.top("artists", "medium_term");
}
