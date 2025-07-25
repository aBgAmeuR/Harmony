'use client';

import { useMemo, useState } from "react";
import { ArrowDownWideNarrowIcon, ArrowUpNarrowWideIcon, } from "lucide-react";

import { Button } from "@repo/ui/button";
import { ButtonGroup } from "@repo/ui/components/button-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";

import { LayoutDescription, LayoutTitle } from "~/components/layouts/layout";
import { MusicLayout } from "~/components/lists/music-layout";
import { SelectListLayout } from "~/features/stats/components/select-list-layout";

import type { ForgottenGem } from "../types";
import { YearSelector } from "./year-selector";

type SortBy = keyof Pick<ForgottenGem, "msPlayed" | "playCount">;

type ForgottenGemsClientProps = {
    forgottenGems: ForgottenGem[];
};

export const ForgottenGemsClient = ({ forgottenGems }: ForgottenGemsClientProps) => {
    const [selectedYear, setSelectedYear] = useState<number | undefined>();
    const [sortBy, setSortBy] = useState<SortBy>("msPlayed");
    const [order, setOrder] = useState<"asc" | "desc">("desc");

    const availableYears = useMemo(() => Array.from(new Set(forgottenGems.map((gem) => gem.year))), [forgottenGems]);
    const filteredForgottenGems = useMemo(() => {
        if (selectedYear) {
            return forgottenGems.filter((gem) => gem.year === selectedYear);
        }
        return forgottenGems;
    }, [forgottenGems, selectedYear]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <LayoutTitle>Forgotten Gems</LayoutTitle>
                    <LayoutDescription>Rediscover tracks you loved but haven't played recently</LayoutDescription>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                    <YearSelector
                        availableYears={availableYears}
                        selectedYear={selectedYear}
                        onYearChange={setSelectedYear}
                    />
                    <ButtonGroup size="sm">
                        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
                            <SelectTrigger size="sm">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="msPlayed">Most Listened</SelectItem>
                                <SelectItem value="playCount">Most Played</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon" className="size-8!" onClick={() => setOrder(order === "asc" ? "desc" : "asc")}>
                            {order === "asc" ? <ArrowUpNarrowWideIcon className="size-4" /> : <ArrowDownWideNarrowIcon className="size-4" />}
                        </Button>
                    </ButtonGroup>
                    <SelectListLayout />
                </div>
            </div>
            <MusicLayout data={[...filteredForgottenGems].sort((a, b) => order === "asc" ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]).slice(0, 50)} config={{ label: "Forgotten Gems", showRank: true }} />
        </div>
    );
};