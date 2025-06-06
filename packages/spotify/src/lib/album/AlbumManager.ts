import type { Album } from "../../types";
import { chunk } from "../../util/chunk";
import { Manager } from "../Manager";

export class AlbumManager extends Manager {
	/**
	 * @description Get a album by ID.
	 * @param {string} id
	 * @returns {Promise<Album[]>} Returns a promise with a single {@link Album}.
	 */
	async get(id: string): Promise<Album | null> {
		try {
			return await this.http.get<Album>(`/v1/albums/${id}`);
		} catch (error) {
			return null;
		}
	}
	
	/**
	 * @description Get multiple albums by ID.
	 * @param {string[]} ids Array of IDs.
	 * @returns {Promise<Album[]>} Returns a promise with an array of {@link Album}s.
	 */
	async list(ids: string[]): Promise<Album[]> {
		const albums = await Promise.all(
			chunk([...ids], 20).map(async (chunk) => {
				const res = await this.http.get<{
					albums: Album[];
				}>("/v1/albums", { ids: chunk.join(",") });
				return res.albums;
			}),
		);

		return albums.flat();
	}
}
