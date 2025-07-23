"use client";

import { Calendar, ChevronsUpDown } from "lucide-react";

import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";

interface YearSelectorProps {
    availableYears: number[];
    selectedYear?: number;
    onYearChange: (year?: number) => void;
}

export function YearSelector({
    availableYears,
    selectedYear,
    onYearChange,
}: YearSelectorProps) {

    const getCurrentSelection = () => {
        if (selectedYear) {
            return <span>{selectedYear}</span>;
        }
        return <span>All Years</span>;
    };

    const sortedYears = [...availableYears].sort((a, b) => b - a);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <Calendar className="size-4" />
                    {getCurrentSelection()}
                    <ChevronsUpDown className="size-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onYearChange(undefined)}>
                    <div className="flex w-full items-center justify-between">
                        <span>All Years</span>
                        {!selectedYear && (
                            <Badge variant="secondary" className="text-xs">
                                Current
                            </Badge>
                        )}
                    </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {sortedYears.map((yearOption) => {
                    const isSelected = selectedYear === yearOption;

                    return (
                        <DropdownMenuItem
                            key={yearOption}
                            onClick={() => onYearChange(yearOption)}
                            className={`
								${isSelected ? 'bg-accent' : ''}
							`}
                        >
                            <div className="flex w-full items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span>{yearOption}</span>
                                    {isSelected && (
                                        <Badge variant="default" className="text-xs">
                                            Selected
                                        </Badge>
                                    )}
                                </div>
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
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 