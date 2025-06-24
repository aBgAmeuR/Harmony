"use client";

import { Button } from "@repo/ui/button";
import { HistoryIcon } from "lucide-react";
import { useHistoricalModalContext } from "~/features/stats/components/historical-provider";
import type { MusicItemCardProps } from "./type";

type HistoricalRankingsProps = {
	item: MusicItemCardProps["item"];
};

export function HistoricalRankings({ item }: HistoricalRankingsProps) {
	const { setItem } = useHistoricalModalContext();

	return (
		<Button
			onClick={() => setItem({
				id: item.id,
				name: item.name,
				href: item.href,
			})}
			variant="ghost"
			size="icon"
		>
			<HistoryIcon className="size-4" />
		</Button>
	);
}
