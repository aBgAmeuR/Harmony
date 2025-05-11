export type MusicItemCardProps = {
	item: {
		id: string;
		name: string;
		href: string;
		image?: string;
		artists?: string;
		stat1?: string;
		stat2?: string;
		description?: React.ReactNode;
		rankChange?: "up" | "down" | "new";
	};
	rank?: number;
	showAction?: boolean;
	showHistoricalRankings?: boolean;
	actionHref?: string;
	layout?: "grid" | "list";
	className?: string;
};
