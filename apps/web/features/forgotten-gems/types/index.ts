import type { MusicItemCardProps } from "~/components/cards/music-item-card/type";

export type ForgottenGem = MusicItemCardProps["item"] & {
	year: number;
	score: number;
};
