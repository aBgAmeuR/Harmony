/**
 * Track information retrieved from Spotify API
 */
export interface TrackInfo {
	artists: string[];
	album: string;
	artistsAlbums: string[];
}

/**
 * Processed track data ready for database insertion
 */
export interface ProcessedTrack {
	timestamp: string;
	platform: string;
	msPlayed: number;
	spotifyId: string;
	artistIds: string[];
	albumId: string;
	albumArtistIds: string[];
	reasonStart: string;
	reasonEnd: string;
	shuffle: boolean | null;
	skipped: boolean | null;
	offline: boolean | null;
}
