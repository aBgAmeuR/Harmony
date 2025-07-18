import type { ACTIONS_HREF } from "~/components/cards/music-item-card";

export type MusicListConfig = {
	label: string;
	actionHref?: keyof typeof ACTIONS_HREF;
	showRank?: boolean;
	showHistoricalRankings?: boolean;
};
