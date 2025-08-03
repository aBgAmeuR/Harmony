// Generic types for comparison data
export interface ComparisonMetrics {
	total: {
		streams: number;
		listeningTime: number;
	};
	unique: {
		tracks: number;
		albums: number;
		artists?: number; // Optional for artist-vs-artist comparison
	};
	monthly: Array<{
		month: string;
		listeningTime: number;
		streams: number;
	}>;
	topTracks?: Array<{
		id?: string;
		trackId?: string;
		name?: string;
		plays: number;
		time: number;
		msPlayed?: number;
		image?: string;
		artists?: string[];
	}>;
	topAlbums?: Array<{
		id?: string;
		albumId?: string;
		name?: string;
		plays: number;
		time: number;
		msPlayed?: number;
		image?: string;
	}>;
	topArtists?: Array<{
		id: string;
		name: string;
		plays: number;
		msPlayed: number;
		image: string;
	}>;
	// For year-over-year specific fields
	year?: number;
	totalListeningTime?: number;
	numStreams?: number;
	uniqueTracks?: number;
	uniqueAlbums?: number;
	uniqueArtists?: number;
}

export interface ComparisonConfig {
	type: "year-over-year" | "artist-vs-artist";
	label1: string;
	label2: string;
	chartTitle: string;
	chartDescription: string;
	lineChartTitle: string;
	lineChartDescription: string;
}
