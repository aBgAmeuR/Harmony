"use client";

import { Button, buttonVariants } from "@repo/ui/button";
import {
	Credenza,
	CredenzaContent,
	CredenzaDescription,
	CredenzaFooter,
	CredenzaHeader,
	CredenzaTitle,
} from "@repo/ui/credenza";
import { cn } from "@repo/ui/lib/utils";
import { Spinner } from "@repo/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import type { PropsWithChildren, ReactNode } from "react";
import type { MusicItemCardProps } from "~/components/cards/music-item-card/type";
import { HistoricalRankingsChart } from "~/components/charts/historical-rankings-chart";
import { Icons } from "~/components/icons";
import { useModals } from "~/lib/store";

interface HistoricalRankingsModalProps extends PropsWithChildren {
	type: "artist" | "track";
	getHistoricalRankings: (id: string) => Promise<any[]>;
}

export const HistoricalRankingsModal = ({
	type,
	getHistoricalRankings,
	children,
}: HistoricalRankingsModalProps) => {
	const { getModalOpen, closeModal } = useModals();
	const historicalRankingsIsOpen = getModalOpen("historical-rankings") as
		| MusicItemCardProps["item"]
		| undefined;

	const {
		data: historicalRankings,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["historical-rankings", type, historicalRankingsIsOpen?.id],
		queryFn: () => getHistoricalRankings(historicalRankingsIsOpen?.id ?? ""),
		enabled: !!historicalRankingsIsOpen?.id,
		staleTime: Number.POSITIVE_INFINITY,
		gcTime: 1000 * 60 * 60 * 24, // 24 hours
	});

	return (
		<>
			{children}
			<Credenza
				open={!!historicalRankingsIsOpen}
				onOpenChange={(open) => {
					if (!open) closeModal("historical-rankings");
				}}
			>
				<CredenzaContent className="md:max-w-[600px]">
					<CredenzaHeader>
						<CredenzaTitle>Historical Rankings</CredenzaTitle>
						<CredenzaDescription>
							See how {historicalRankingsIsOpen?.name} has ranked over time.
						</CredenzaDescription>
					</CredenzaHeader>
					<div className="w-full px-4 md:px-0">
						{isLoading && (
							<div className="flex aspect-video w-full flex-col items-center justify-center gap-1">
								<Spinner className="size-4" />
								<p className="text-muted-foreground text-sm">
									Loading historical rankings...
								</p>
							</div>
						)}
						{isError && (
							<div className="flex aspect-video w-full flex-col items-center justify-center gap-1">
								<AlertCircle className="size-4 text-muted-foreground" />
								<p className="text-muted-foreground text-sm">
									Error loading historical rankings.
								</p>
							</div>
						)}
						{historicalRankings && (
							<HistoricalRankingsChart
								data={historicalRankings}
								className="aspect-video w-full"
							/>
						)}
					</div>
					<CredenzaFooter>
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
					</CredenzaFooter>
				</CredenzaContent>
			</Credenza>
		</>
	);
};
