import type { Image } from "./shared";
import type { ExternalUrls } from "./shared/ExternalUrls";
import type { Followers } from "./shared/Followers";

export interface ArtistSimplified {
	external_urls: ExternalUrls;
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
}

export interface Artist extends ArtistSimplified {
	followers: Followers;
	genres: string[];
	images: Image[];
	popularity: number;
}
