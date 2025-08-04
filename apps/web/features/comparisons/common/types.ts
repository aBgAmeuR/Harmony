import type { MusicItemCardProps } from "~/components/cards/music-item-card/type";

export type ComparisonMetrics2 = {
	total: {
		streams: number;
		listeningTime: number;
	};
	unique: {
		tracks: number;
		albums: number;
		artists?: number;
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
};

export type ComparisonMetrics = {
	label: string;
	cards: {
		[key: string]: number;
	};
	monthly: {
		month: string;
		listeningTime: number;
		streams: number;
	}[];
	totalListeningTime: number;
	totalStreams: number;
	rank1: MusicItemCardProps["item"][];
	rank2: MusicItemCardProps["item"][];
};

// { title: "Listening Time", icon: Clock },
//         { title: "Unique Tracks", icon: Music },
//         { title: "Unique Artists", icon: Users },
//         { title: "Unique Albums", icon: Disc3 },

// 		{ title: "Listening Time", icon: Clock },
//         { title: "Total Streams", icon: Music },
//         { title: "Unique Tracks", icon: Users },
//         { title: "Unique Albums", icon: Disc3 },
