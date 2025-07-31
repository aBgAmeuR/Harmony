'use client';

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRightIcon } from "lucide-react";
import { parseAsInteger, useQueryState } from 'nuqs';

import { buttonVariants } from "@repo/ui/button";
import { ButtonGroup } from "@repo/ui/components/button-group";
import { cn } from "@repo/ui/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";
import { Skeleton } from "@repo/ui/skeleton";

import { getAvailableYearsAction } from "../actions/available-years-action";

const useAvailableYears = () => useQuery({
    queryKey: ['available-years'],
    queryFn: getAvailableYearsAction,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
});

export const YearSelector = () => {
    const [year1, setYear1] = useQueryState('year1', parseAsInteger.withDefault(new Date().getFullYear()));
    const [year2, setYear2] = useQueryState('year2', parseAsInteger.withDefault(new Date().getFullYear() - 1));
    const { data: availableYears, isLoading } = useAvailableYears();
    const queryClient = useQueryClient();

    if (isLoading) return <YearSelectorSkeleton />;
    if (!availableYears || availableYears.length < 1) return null;

    return (
        <ButtonGroup>
            <Select value={year1?.toString()} onValueChange={(v) => {
                setYear1(parseInt(v));
                queryClient.invalidateQueries({ queryKey: ['yearMetrics', year1] });
            }}>
                <SelectTrigger size='sm'>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {availableYears.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                            {y}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <div className={cn(buttonVariants({ variant: "outline", size: "icon" }), "flex size-8! items-center justify-center p-0!")}>
                <ArrowRightIcon className="size-4 text-muted-foreground" />
            </div>
            <Select value={year2?.toString()} onValueChange={(v) => {
                setYear2(parseInt(v));
                queryClient.invalidateQueries({ queryKey: ['yearMetrics', year2] });
            }}>
                <SelectTrigger size='sm'>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {availableYears.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                            {y}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </ButtonGroup>
    );
};

export const YearSelectorSkeleton = () => {
    return (
        <Skeleton className="h-8 w-[217px]" />
    );
};