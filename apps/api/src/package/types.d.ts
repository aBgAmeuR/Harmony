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

export type DataType = {
	ts: string;
	username: string;
	platform: string;
	ms_played: number;
	conn_country: string;
	ip_addr_decrypted: string;
	user_agent_decrypted: string;
	master_metadata_track_name: string;
	master_metadata_album_artist_name: string;
	master_metadata_album_album_name: string;
	spotify_track_uri: string;
	episode_name: string;
	episode_show_name: string;
	spotify_episode_uri: string;
	reason_start: string;
	reason_end: string;
	shuffle: boolean | null;
	skipped: boolean | null;
	offline: boolean | null;
	offline_timestamp: number;
	incognito_mode: boolean | null;
};
