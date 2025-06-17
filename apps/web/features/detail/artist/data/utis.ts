"server-only";

import { spotify } from "@repo/spotify";
import { unstable_cacheLife as cacheLife } from "next/cache";
import { cache } from "react";

export const getArtistDetails = cache(
	async (artistId: string, userId: string) => {
		"use cache";
		cacheLife("days");

		spotify.setUserId(userId);
		return await spotify.artists.get(artistId);
	},
);
