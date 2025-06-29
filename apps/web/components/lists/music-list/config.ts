export type MusicListConfig = {
	label: string;
	actionHref?: null | ((string: string) => string);
	showRank?: boolean;
	showHistoricalRankings?: boolean;
};
