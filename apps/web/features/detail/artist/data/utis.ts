"server-only";

import { cache } from "react";
import { unstable_cacheLife as cacheLife } from "next/cache";

import { spotify } from "@repo/spotify";

export const getArtistDetails = cache(
	async (artistId: string, userId: string) => {
		"use cache";
		cacheLife("days");

		spotify.setUserId(userId);
		return await spotify.artists.get(artistId);
	},
);
