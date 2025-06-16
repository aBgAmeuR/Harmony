"server-only";

import { spotify } from "@repo/spotify";
import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";
import { cache } from "react";

export const getAlbumDetails = cache(
	async (albumId: string, userId: string) => {
		"use cache";
		cacheLife("days");
		cacheTag("album-details");

		spotify.setUserId(userId);
		return await spotify.albums.getAlbum(albumId);
	},
);
