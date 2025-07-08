"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { ForgottenGemsListMinimal } from "~/features/forgotten-gems/components/forgotten-gems-list-minimal";
import { YearSelector } from "~/features/forgotten-gems/components/year-selector";
import { getAvailableYears, getForgottenGems } from "~/features/forgotten-gems/data/forgotten-gems-service";

type ForgottenGemsClientProps = {
    userId: string;
    isDemo: boolean;
};

export function ForgottenGemsClient({ userId, isDemo }: ForgottenGemsClientProps) {
    const [selectedYear, setSelectedYear] = useState<number | undefined>();
    const [selectedYearRange, setSelectedYearRange] = useState<{ start: number; end: number } | undefined>();

    const { data: availableYears = [], isLoading: isLoadingYears } = useQuery({
        queryKey: ["available-years", userId],
        queryFn: () => getAvailableYears(userId),
    });

    const { data: gems = [], isLoading } = useQuery({
        queryKey: ["forgotten-gems", userId, selectedYear, selectedYearRange],
        queryFn: async () => await getForgottenGems(userId, {
            selectedYear,
            yearRange: selectedYearRange,
        }),
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-bold text-2xl tracking-tight">Forgotten Gems</h1>
                    <p className="text-muted-foreground text-sm">
                        Rediscover tracks you loved but haven't played recently
                    </p>
                </div>
                <YearSelector
                    availableYears={availableYears}
                    selectedYear={selectedYear}
                    selectedYearRange={selectedYearRange}
                    onYearChange={setSelectedYear}
                    onYearRangeChange={setSelectedYearRange}
                    isLoading={isLoadingYears}
                />
            </div>

            {!isLoading && (
                <div className="text-center">
                    <div className="font-bold text-3xl">{gems.length}</div>
                    <div className="text-muted-foreground text-sm">forgotten gems found</div>
                </div>
            )}

            {isLoading && (
                <div className="text-center">
                    <div className="mx-auto h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <div className="mt-2 text-muted-foreground text-sm">Analyzing your music...</div>
                </div>
            )}

            <ForgottenGemsListMinimal gems={gems} isLoading={isLoading} />
        </div>
    );
}