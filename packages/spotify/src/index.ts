import { SpotifyAPI } from "./lib/SpotifyAPI";

const spotify = new SpotifyAPI({
	clientId: process.env.AUTH_SPOTIFY_ID || "missing",
	clientSecret: process.env.AUTH_SPOTIFY_SECRET || "missing",
	debug: true,
});

export { spotify, SpotifyAPI };