'use client';

import { useMemo, useState } from "react";

import { MusicLayout } from "~/components/lists/music-layout";
import { SelectListLayout } from "~/features/stats/components/select-list-layout";

import type { ForgottenGem } from "../types";
import { YearSelector } from "./year-selector";

type ForgottenGemsClientProps = {
    forgottenGems: ForgottenGem[];
};

export const ForgottenGemsClient = ({ forgottenGems }: ForgottenGemsClientProps) => {
    const [selectedYear, setSelectedYear] = useState<number | undefined>();

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
                    <h1 className="font-bold text-2xl tracking-tight">Forgotten Gems</h1>
                    <p className="text-muted-foreground text-sm">
                        Rediscover tracks you loved but haven't played recently
                    </p>
                </div>
                <div className="flex items-center justify-end gap-2">
                    <YearSelector
                        availableYears={availableYears}
                        selectedYear={selectedYear}
                        onYearChange={setSelectedYear}
                    />
                    <SelectListLayout />
                </div>
            </div>
            <MusicLayout data={filteredForgottenGems} config={{ label: "Forgotten Gems" }} />
        </div>
    );
};