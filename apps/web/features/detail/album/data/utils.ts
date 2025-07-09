"server-only";

import { cache } from "react";
import { unstable_cacheLife as cacheLife } from "next/cache";

import { spotify } from "@repo/spotify";

export const getAlbumDetails = cache(
	async (albumId: string, userId: string) => {
		"use cache";
		cacheLife("days");

		spotify.setUserId(userId);
		return await spotify.albums.getAlbum(albumId);
	},
);
