'use client';

import { useMemo, useState } from "react";

import { LayoutDescription, LayoutTitle } from "~/components/layouts/layout";
import { MusicLayout } from "~/components/lists/music-layout";
import { SelectListLayout } from "~/features/stats/components/select-list-layout";

import type { ForgottenGem } from "../types";
import { YearSelector } from "./year-selector";

type ForgottenGemsClientProps = {
    forgottenGems: ForgottenGem[];
};

export const ForgottenGemsClient = ({ forgottenGems }: ForgottenGemsClientProps) => {
    const [selectedYear, setSelectedYear] = useState<number | undefined>();
    const [sortBy, _setSortBy] = useState<keyof Pick<ForgottenGem, "msPlayed" | "playCount" | "score">>("msPlayed");

    const availableYears = useMemo(() => Array.from(new Set(forgottenGems.map((gem) => gem.year))), [forgottenGems]);
    const filteredForgottenGems = useMemo(() => {
        if (selectedYear) {
            return forgottenGems.filter((gem) => gem.year === selectedYear);
        }
        return forgottenGems;
    }, [forgottenGems, selectedYear]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <LayoutTitle>Forgotten Gems</LayoutTitle>
                    <LayoutDescription>Rediscover tracks you loved but haven't played recently</LayoutDescription>
                </div>
                <div className="flex items-center justify-end gap-1">
                    <YearSelector
                        availableYears={availableYears}
                        selectedYear={selectedYear}
                        onYearChange={setSelectedYear}
                    />
                    <SelectListLayout />
                </div>
            </div>
            <MusicLayout data={filteredForgottenGems.sort((a, b) => b[sortBy] - a[sortBy]).slice(0, 50)} config={{ label: "Forgotten Gems", showRank: true }} />
        </div>
    );
};