"use client";

import { Button, buttonVariants } from "@repo/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@repo/ui/dialog";
import { cn } from "@repo/ui/lib/utils";
import { Skeleton } from "@repo/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import type { MusicItemCardProps } from "~/components/cards/music-item-card/type";
import { HistoricalRankingsChart } from "~/components/charts/historical-rankings-chart";
import { Icons } from "~/components/icons";
import { useModals } from "~/lib/store";
import { getHistoricalArtistRankings } from "~/services/historical-rankings";

export const Modals = ({ children }: PropsWithChildren) => {
	const { getModalOpen, closeModal } = useModals();
	const historicalRankingsIsOpen = getModalOpen("historical-rankings") as
		| MusicItemCardProps["item"]
		| undefined;

	const { data: historicalRankings, isLoading } = useQuery({
		queryKey: ["historical-rankings", historicalRankingsIsOpen?.id],
		queryFn: () =>
			getHistoricalArtistRankings(historicalRankingsIsOpen?.id ?? ""),
		enabled: !!historicalRankingsIsOpen?.id,
		staleTime: Number.POSITIVE_INFINITY,
		gcTime: 1000 * 60 * 60 * 24, // 24 hours
	});

	return (
		<>
			{children}
			<Dialog
				open={!!historicalRankingsIsOpen}
				onOpenChange={(open) => {
					if (!open) closeModal("historical-rankings");
				}}
			>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>Historical Rankings</DialogTitle>
						<DialogDescription>
							See how {historicalRankingsIsOpen?.name} has ranked over time.
						</DialogDescription>
					</DialogHeader>
					<div className="h-[309px] w-full">
						{isLoading && <Skeleton className="size-full" />}
						{historicalRankings && (
							<HistoricalRankingsChart
								data={historicalRankings}
								className="w-full"
							/>
						)}
					</div>
					<DialogFooter>
						<a
							className={cn(buttonVariants({ variant: "secondary" }))}
							href={historicalRankingsIsOpen?.href}
							target="_blank"
							rel="noreferrer"
						>
							<Icons.spotify className="size-4" />
							Open in Spotify
						</a>
						<Button
							variant="outline"
							onClick={() => closeModal("historical-rankings")}
						>
							Close
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};
