import type { SpotifyConfig } from "../types/SpotifyConfig";

export class Logger {
	constructor(protected config: SpotifyConfig) {}

	log(message: string) {
		if (this.config.debug) {
			console.log(message);
		}
	}
}
