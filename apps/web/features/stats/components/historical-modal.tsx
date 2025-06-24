"use client";

import { Button } from "@repo/ui/button";
import { LinkButton } from "@repo/ui/components/link-button";
import {
    Credenza,
    CredenzaContent,
    CredenzaDescription,
    CredenzaFooter,
    CredenzaHeader,
    CredenzaTitle,
} from "@repo/ui/credenza";
import { Spinner } from "@repo/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, InfoIcon } from "lucide-react";
import { Icons } from "~/components/icons";
import { HistoricalChart } from "./historical-chart";
import { useHistoricalModalContext } from "./historical-provider";

type HistoricalModalProps = {
    promise: (id: string) => Promise<{
        rank: number | null;
        timestamp: Date;
    }[]>;
}

export const HistoricalModal = ({ promise }: HistoricalModalProps) => {
    const { item, setItem } = useHistoricalModalContext();

    const {
        data: historicalRankings,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["historical-rankings", item?.id],
        queryFn: () => promise(item?.id ?? ""),
        enabled: !!item?.id,
        staleTime: Number.POSITIVE_INFINITY,
        gcTime: 1000 * 60 * 60 * 24,
    });

    return (
        <Credenza
            open={!!item?.id}
            onOpenChange={(open) => {
                if (!open) setItem(null);
            }}
        >
            <CredenzaContent className="md:max-w-[600px]">
                <CredenzaHeader>
                    <CredenzaTitle>Historical Rankings</CredenzaTitle>
                    <CredenzaDescription>
                        See how {item?.name} has ranked over time.
                    </CredenzaDescription>
                </CredenzaHeader>
                <div className="mx-4 mb-2 rounded-md border bg-muted px-4 py-3 md:mx-0 md:mb-0">
                    <p className="text-sm">
                        <InfoIcon
                            className="-mt-0.5 me-3 inline-flex text-blue-500"
                            size={16}
                            aria-hidden="true"
                        />
                        This information is updated at the beginning of each week.
                    </p>
                </div>
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
                    {historicalRankings && <HistoricalChart data={historicalRankings} />}
                </div>
                <CredenzaFooter>
                    {item?.href && (
                        <LinkButton href={item.href} target="_blank" rel="noreferrer" variant="secondary">
                            <Icons.spotify className="size-4" />
                            Open in Spotify
                        </LinkButton>
                    )}
                    <Button variant="outline" onClick={() => setItem(null)}>
                        Close
                    </Button>
                </CredenzaFooter>
            </CredenzaContent>
        </Credenza >
    );
};
