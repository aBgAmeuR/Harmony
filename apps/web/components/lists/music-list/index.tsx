import { Info } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { Separator } from "@repo/ui/separator";

import { MusicItemCard } from "~/components/cards/music-item-card";
import type { MusicItemCardProps } from "~/components/cards/music-item-card/type";

import type { MusicListConfig } from "./config";
import { MusicListError } from "./error";

type MusicListProps = {
	data: Array<MusicItemCardProps["item"]> | null;
	config: MusicListConfig;
};

export const MusicList = ({ data, config }: MusicListProps) => {
	if (!data) return <MusicListError />;

	return (
		<div className="flex flex-col">
			{data.map((item, index) => (
				<div
					key={`${item.id}-${index}-${config.label}`}
					className="flex flex-col"
				>
					<MusicItemCard
						item={item}
						rank={config.showRank ? index + 1 : undefined}
						showAction={!!config.actionHref}
						showHistoricalRankings={config.showHistoricalRankings}
						actionHref={config.actionHref?.(item.id)}
					/>
					{index < data.length - 1 && <Separator />}
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
