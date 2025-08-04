import type { MusicItemCardProps } from "~/components/cards/music-item-card/type";

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
