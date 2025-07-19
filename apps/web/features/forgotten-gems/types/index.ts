export interface YearOption {
	year: number;
	trackCount: number;
	label: string;
}

export interface TrackPlayData {
	spotifyId: string;
	timestamp: Date;
	msPlayed: number;
	skipped: boolean | null;
	reasonEnd: string;
}

export interface ForgottenGem {
	spotifyId: string;
	name: string;
	artists: string[];
	albumName: string;
	image: string;
	spotifyUrl: string;
	durationMs: number;
	totalPlays: number;
	totalMsPlayed: number;
	firstPlayed: Date;
	lastPlayed: Date;
	daysSinceLastPlayed: number;
	reasonScore?: number;
}
