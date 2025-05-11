"use client";

import { Button } from "@repo/ui/button";
import { HistoryIcon } from "lucide-react";
import { useModals } from "~/lib/store";
import type { MusicItemCardProps } from "./type";

type HistoricalRankingsProps = {
	item: MusicItemCardProps["item"];
};

export function HistoricalRankings({ item }: HistoricalRankingsProps) {
	const { openModal } = useModals();

	return (
		<Button
			onClick={() => openModal("historical-rankings", item)}
			variant="ghost"
			size="icon"
		>
			<HistoryIcon className="size-4" />
		</Button>
	);
}
