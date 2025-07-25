import { LibraryBigIcon, } from "lucide-react";

import { Card, CardContent, CardDescription, CardTitle } from "@repo/ui/card";
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
		<div
			className={cn(layout === "grid" ? "grid grid-cols-2 xs:grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7" : "flex flex-col")}
		>
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
					{layout === "list" && index < data.length - 1 && <Separator className="my-2" />}
				</div>
			))}
			{data.length === 0 && (
				<div className={cn(layout === "grid" && "col-span-full")}>
					<Card className="flex-row gap-0 border-dashed p-4">
						<LibraryBigIcon className="size-10 shrink-0 text-muted-foreground" />
						<CardContent className="flex flex-col items-start justify-center gap-1 pr-0 pl-2 md:pl-4">
							<CardTitle>No {config.label} Found</CardTitle>
							<CardDescription>
								It seems you haven&apos;t listened to any {config.label.toLowerCase()} during this period. Time to discover some new tunes and build your listening history!
							</CardDescription>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
};
