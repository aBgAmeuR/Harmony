'use client';

import { useAtom } from 'jotai';
import { atomWithQuery } from 'jotai-tanstack-query'
import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";

import { getYearMetricsAction } from "../actions/year-metrics-action";
import { GroupedBarChart, GroupedBarChartSkeleton } from "./grouped-bar-chart";
import { LineChartEvolution, LineChartEvolutionSkeleton } from "./line-chart-evolution";
import { StatsCards, StatsCardsSkeleton } from "./stats-cards";
import { TopItemsCards, TopItemsCardsSkeleton } from "./top-items-cards";
import { year1Atom, year2Atom } from './year-selector';

const metrics1Atom = atomWithQuery((get) => ({
    queryKey: ["yearMetrics", get(year1Atom)],
    queryFn: async ({ queryKey: [, year] }) => getYearMetricsAction(year as number),
}));

const metrics2Atom = atomWithQuery((get) => ({
    queryKey: ["yearMetrics", get(year2Atom)],
    queryFn: async ({ queryKey: [, year] }) => getYearMetricsAction(year as number),
}));

export function ComparisonContent() {
    const [{ data: metrics1, isPending: isLoading1, isError: isError1 }] = useAtom(metrics1Atom);
    const [{ data: metrics2, isPending: isLoading2, isError: isError2 }] = useAtom(metrics2Atom);

    if (isLoading1 || isLoading2) return <ComparisonContentSkeleton />;
    if (!metrics1 || !metrics2 || isError1 || isError2) return <ComparisonContentError />;

    return (
        <div className="space-y-4">
            <StatsCards metrics1={metrics1} metrics2={metrics2} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                <LineChartEvolution metrics1={metrics1} metrics2={metrics2} className="lg:col-span-3" />
                <GroupedBarChart metrics1={metrics1} metrics2={metrics2} className="w-full" />
            </div>
            <TopItemsCards metrics1={metrics1} metrics2={metrics2} />
        </div>
    );
}

export const ComparisonContentSkeleton = () => {
    return (
        <div className="space-y-4">
            <StatsCardsSkeleton />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                <LineChartEvolutionSkeleton className="lg:col-span-3" />
                <GroupedBarChartSkeleton className="w-full" />
            </div>
            <TopItemsCardsSkeleton />
        </div>
    );
};

const ComparisonContentError = () => {
    return (
        <div className="flex min-h-[300px] items-center justify-center p-4 sm:min-h-[400px] sm:p-6">
            <Card className="w-full max-w-sm sm:max-w-md">
                <CardHeader className="space-y-3 text-center sm:space-y-4">
                    <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-destructive/10 sm:size-12">
                        <AlertCircle className="size-5 text-destructive sm:size-6" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl">Failed to Load Data</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                        We encountered an error while loading your year-over-year comparison data.
                        This might be due to a temporary network issue or server problem.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <Button onClick={() => window.location.reload()} className="w-full" size="default">
                        <RefreshCw className="mr-2 size-4" />
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};