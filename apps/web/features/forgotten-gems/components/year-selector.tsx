"use client";

import { useState } from "react";
import { ArrowRight, Calendar, ChevronsUpDown } from "lucide-react";

import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";

import type { YearOption } from "../types";

interface YearSelectorProps {
    availableYears: YearOption[];
    selectedYear?: number;
    selectedYearRange?: { start: number; end: number };
    onYearChange: (year?: number) => void;
    onYearRangeChange: (range?: { start: number; end: number }) => void;
    isLoading?: boolean;
}

export function YearSelector({
    availableYears,
    selectedYear,
    selectedYearRange,
    onYearChange,
    onYearRangeChange,
    isLoading = false,
}: YearSelectorProps) {
    const [rangeStart, setRangeStart] = useState<number | null>(null);

    const getCurrentSelection = () => {
        if (selectedYear) {
            return <span>{selectedYear}</span>;
        }
        if (selectedYearRange) {
            return (
                <div className="flex items-center gap-1">
                    <span>{selectedYearRange.start}</span>
                    <ArrowRight className="size-3" />
                    <span>{selectedYearRange.end}</span>
                </div>
            );
        }
        return <span>All Years</span>;
    };

    const handleYearSelect = (year: number) => {
        if (rangeStart !== null) {
            const start = Math.min(rangeStart, year);
            const end = Math.max(rangeStart, year);
            onYearRangeChange({ start, end });
            setRangeStart(null);
        } else {
            onYearChange(year);
            onYearRangeChange(undefined);
        }
    };

    const startRangeSelection = (year: number) => {
        setRangeStart(year);
        onYearChange(undefined);
        onYearRangeChange(undefined);
    };

    const clearSelection = () => {
        onYearChange(undefined);
        onYearRangeChange(undefined);
        setRangeStart(null);
    };

    const sortedYears = [...availableYears].sort((a, b) => b.year - a.year);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={isLoading} size="sm">
                    <Calendar className="size-4" />
                    {getCurrentSelection()}
                    <ChevronsUpDown className="size-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={clearSelection}>
                    <div className="flex w-full items-center justify-between">
                        <span>All Years</span>
                        {!selectedYear && !selectedYearRange && (
                            <Badge variant="secondary" className="text-xs">
                                Current
                            </Badge>
                        )}
                    </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {rangeStart !== null && (
                    <DropdownMenuItem disabled>
                        <span className="text-muted-foreground text-sm">
                            Select another year
                        </span>
                    </DropdownMenuItem>
                )}

                {sortedYears.map((yearOption) => {
                    const isSelected = selectedYear === yearOption.year;
                    const isInRange = selectedYearRange &&
                        yearOption.year >= selectedYearRange.start &&
                        yearOption.year <= selectedYearRange.end;
                    const isRangeStart = rangeStart === yearOption.year;

                    return (
                        <DropdownMenuItem
                            key={yearOption.year}
                            onClick={() => handleYearSelect(yearOption.year)}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                startRangeSelection(yearOption.year);
                            }}
                            className={`
								${isSelected || isInRange || isRangeStart ? 'bg-accent' : ''}
							`}
                        >
                            <div className="flex w-full items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span>{yearOption.year}</span>
                                    {isSelected && (
                                        <Badge variant="default" className="text-xs">
                                            Selected
                                        </Badge>
                                    )}
                                    {isInRange && !isSelected && (
                                        <Badge variant="secondary" className="text-xs">
                                            Range
                                        </Badge>
                                    )}
                                    {isRangeStart && (
                                        <Badge variant="outline" className="text-xs">
                                            Start
                                        </Badge>
                                    )}
                                </div>
                                <span className="text-muted-foreground text-xs">
                                    {yearOption.trackCount.toLocaleString()}
                                </span>
                            </div>
                        </DropdownMenuItem>
                    );
                })}

                {sortedYears.length === 0 && (
                    <DropdownMenuItem disabled>
                        <span className="text-muted-foreground text-sm">
                            No data available
                        </span>
                    </DropdownMenuItem>
                )}

                {sortedYears.length > 1 && (
                    <>
                        <DropdownMenuSeparator />
                        <div className="px-2 py-1 text-muted-foreground text-xs">
                            Right-click for range selection
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 