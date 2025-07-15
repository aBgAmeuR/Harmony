"use client";

import { Info } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { cn } from "@repo/ui/lib/utils";

import { MusicItemCard } from "~/components/cards/music-item-card";
import type { MusicItemCardProps } from "~/components/cards/music-item-card/type";
import { useListLayout } from "~/lib/store";

import type { MusicListConfig } from "../music-list/config";
import { MusicListError } from "../music-list/error";

type MusicLayoutProps = {
    data: Array<MusicItemCardProps["item"]> | null;
    config: MusicListConfig;
};

export const MusicLayout = ({ data, config }: MusicLayoutProps) => {
    const listLayout = useListLayout((state) => state.list_layout);

    // TODO: handle error
    if (!data) return <MusicListError />;

    return (
        <div className={cn(listLayout === "grid" ? "grid grid-cols-2 xs:grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7" : "flex flex-col")}>
            {data.map((item, index) => (
                <MusicItemCard
                    key={`${item.id}-${index}-${config.label}`}
                    item={item}
                    rank={config.showRank ? index + 1 : undefined}
                    showAction={!!config.actionHref}
                    showHistoricalRankings={config.showHistoricalRankings}
                    actionHref={config.actionHref?.(item.id)}
                    layout={listLayout}
                />
            ))}
            {data.length === 0 && (
                <Alert variant="info" className="col-span-full">
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