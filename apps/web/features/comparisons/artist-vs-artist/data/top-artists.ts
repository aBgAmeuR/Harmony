"server-only";

import { spotify } from "@repo/spotify";

export async function getTopArtists(userId: string) {
	spotify.setUserId(userId);
	return await spotify.me.top("artists", "medium_term");
}
