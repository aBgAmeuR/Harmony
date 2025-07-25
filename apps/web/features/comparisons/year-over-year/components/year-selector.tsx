'use client';

import { useQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsInteger, useQueryState } from 'nuqs';

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
    const [year1, setYear1] = useQueryState('year1', parseAsInteger);
    const [year2, setYear2] = useQueryState('year2', parseAsInteger);
    const { data: availableYears, isLoading } = useAvailableYears();
    const router = useRouter();

    if (isLoading) return <YearSelectorSkeleton />;
    if (!availableYears || availableYears.length < 1) return null;

    return (
        <>
            <Select value={year1?.toString()} onValueChange={(v) => {
                setYear1(parseInt(v));
                router.refresh();
            }}>
                <SelectTrigger size='sm'>
                    <Calendar className="size-4 text-muted-foreground" />
                    <SelectValue placeholder="Year 1" />
                </SelectTrigger>
                <SelectContent>
                    {availableYears.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                            {y}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={year2?.toString()} onValueChange={(v) => {
                setYear2(parseInt(v));
                router.refresh();
            }}>
                <SelectTrigger size='sm'>
                    <Calendar className="size-4 text-muted-foreground" />
                    <SelectValue placeholder="Year 2" />
                </SelectTrigger>
                <SelectContent>
                    {availableYears.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                            {y}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </>
    );
};

export const YearSelectorSkeleton = () => {
    return (
        <>
            <Skeleton className="h-8 w-[108px]" />
            <Skeleton className="h-8 w-[108px]" />
        </>
    );
};