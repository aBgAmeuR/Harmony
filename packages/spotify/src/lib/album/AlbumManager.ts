import type { Album, Track } from "../../types";
import { chunk } from "../../util/chunk";
import { Manager } from "../Manager";

export class AlbumManager extends Manager {
	/**
	 * @description Get an album by ID.
	 * @param {string} id Album ID.
	 * @returns {Promise<Album | null>} Returns a promise with a single {@link Album}.
	 */
	async getAlbum(id: string): Promise<Album | null> {
		try {
			return await this.http.get<Album>(`/v1/albums/${id}`);
		} catch (error) {
			return null;
		}
	}

	/**
	 * @description Get an album's tracks.
	 * @param {string} id Album ID.
	 * @returns {Promise<{ items: Track[] }>} Returns a promise with the album's tracks.
	 */
	async getTracks(id: string): Promise<{ items: Track[] }> {
		return await this.http.get<{ items: Track[] }>(
			`/v1/albums/${id}/tracks?limit=50`,
		);
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
