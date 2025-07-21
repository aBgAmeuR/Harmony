import { Info } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { cn } from "@repo/ui/lib/utils";
import { Separator } from "@repo/ui/separator";

import { type ACTIONS_HREF, MusicItemCard } from "~/components/cards/music-item-card";
import type { MusicItemCardProps } from "~/components/cards/music-item-card/type";

import { MusicListError } from "./error";

export type MusicListConfig = {
	label: string;
	actionHref?: keyof typeof ACTIONS_HREF;
	showRank?: boolean;
	showHistoricalRankings?: boolean;
	layout?: "grid" | "list";
};

type MusicListProps = {
	data: Array<MusicItemCardProps["item"]> | null;
	config: MusicListConfig;
};

export const MusicList = ({ data, config }: MusicListProps) => {
	if (!data) return <MusicListError />;
	const layout = config.layout ?? "list";

	return (
		<div className={cn(layout === "grid" ? "grid grid-cols-2 xs:grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7" : "flex flex-col")}>
			{data.map((item, index) => (
				<div
					key={`${item.id}-${index}-${config.label}`}
					className="flex flex-col"
				>
					<MusicItemCard
						item={item}
						rank={config.showRank ? index + 1 : undefined}
						showHistoricalRankings={config.showHistoricalRankings}
						showAction={!!config.actionHref}
						actionHref={config.actionHref}
						layout={layout}
					/>
					{layout === "list" && index < data.length - 1 && <Separator />}
				</div>
			))}
			{data.length === 0 && (
				<Alert variant="info">
					<Info className="size-4" />
					<AlertTitle>No {config.label} found</AlertTitle>
					<AlertDescription>
						You haven't listened to any music during this period
					</AlertDescription>
				</Alert>
			)}
		</div>
	);
};
