import type { Artist } from "../../types";
import { chunk } from "../../util/chunk";
import { Manager } from "../Manager";

export class ArtistManager extends Manager {
	/**
	 * @description Get a artist by ID.
	 * @param {string} id
	 * @returns {Promise<Artist[]>} Returns a promise with a single {@link Artist}.
	 */
	async get(id: string): Promise<Artist | null> {
		try {
			return await this.http.get<Artist>(`/v1/artists/${id}`);
		} catch (_error) {
			return null;
		}
	}

	/**
	 * @description Get multiple artists by ID.
	 * @param {string[]} ids Array of IDs.
	 * @returns {Promise<Artist[]>} Returns a promise with an array of {@link Artist}s.
	 */
	async list(ids: string[]): Promise<Artist[]> {
		const artists = await Promise.all(
			chunk([...ids], 50).map(async (chunk) => {
				const res = await this.http.get<{
					artists: Artist[];
				}>("/v1/artists", { ids: chunk.join(",") });
				return res.artists;
			}),
		);

		return artists.flat();
	}

	/**
	 * Search for artists by query.
	 * @param query Search query
	 * @param limit Max number of results
	 * @returns Promise<Artist[]>
	 */
	async search(query: string, limit: number = 10): Promise<Artist[]> {
		const res = await this.http.get<{ artists: { items: Artist[] } }>(
			`/v1/search`,
			{
				q: query,
				type: "artist",
				limit: limit.toString(),
			},
		);
		return res.artists.items;
	}
}
