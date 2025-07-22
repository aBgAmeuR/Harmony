"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Spinner } from "@repo/ui/spinner";

import { MusicList } from "~/components/lists/music-list";
import { MusicListSkeleton } from "~/components/lists/music-list/skeleton";
import { YearSelector } from "~/features/forgotten-gems/components/year-selector";
import { getAvailableYears, getForgottenGems } from "~/features/forgotten-gems/data/forgotten-gems-service";

type ForgottenGemsClientProps = {
    userId: string;
};

export function ForgottenGemsClient({ userId }: ForgottenGemsClientProps) {
    const [selectedYear, setSelectedYear] = useState<number | undefined>();
    const [selectedYearRange, setSelectedYearRange] = useState<{ start: number; end: number } | undefined>();

    const { data: availableYears = [], isLoading: isLoadingYears } = useQuery({
        queryKey: ["available-years", userId],
        queryFn: () => getAvailableYears(userId),
    });

    const { data: gems = [], isLoading } = useQuery({
        queryKey: ["forgotten-gems", userId, selectedYear, selectedYearRange],
        queryFn: async () => await getForgottenGems(userId, selectedYear, selectedYearRange),
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-bold text-2xl tracking-tight">Forgotten Gems</h1>
                    <p className="text-muted-foreground text-sm">
                        Rediscover tracks you loved but haven't played recently
                    </p>
                </div>
                <div className="flex items-center justify-end gap-2">
                    {isLoading && (
                        <div className="flex items-center gap-2">
                            <Spinner className="size-4" />
                            <span className="text-muted-foreground text-sm">Analyzing your music</span>
                        </div>
                    )}
                    <YearSelector
                        availableYears={availableYears}
                        selectedYear={selectedYear}
                        selectedYearRange={selectedYearRange}
                        onYearChange={setSelectedYear}
                        onYearRangeChange={setSelectedYearRange}
                        isLoading={isLoadingYears}
                    />
                </div>
            </div>
            {isLoading ? <MusicListSkeleton length={15} showRank={false} /> : <MusicList data={gems} config={{ label: "Forgotten Gems", showRank: false }} />}
        </div>
    );
}