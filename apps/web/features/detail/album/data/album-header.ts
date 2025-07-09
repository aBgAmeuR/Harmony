"server-only";

import { getAlbumDetails } from "./utils";

export const getAlbumHeaderData = async (albumId: string, userId: string) => {
	return await getAlbumDetails(albumId, userId);
};
