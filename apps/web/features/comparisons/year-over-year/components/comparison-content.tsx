'use client';

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, RefreshCw } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";

import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";

import { getYearMetricsAction } from "../actions/year-metrics-action";
import { GroupedBarChart, GroupedBarChartSkeleton } from "./grouped-bar-chart";
import { LineChartEvolution, LineChartEvolutionSkeleton } from "./line-chart-evolution";
import { StatsCards, StatsCardsSkeleton } from "./stats-cards";
import { TopItemsCards, TopItemsCardsSkeleton } from "./top-items-cards";

const useYearMetrics = (year1: number, year2: number) => {
    const metrics1Query = useQuery({
        queryKey: ["yearMetrics", year1],
        queryFn: () => getYearMetricsAction(year1),
        enabled: !!year1,
    });
    const metrics2Query = useQuery({
        queryKey: ["yearMetrics", year2],
        queryFn: () => getYearMetricsAction(year2),
        enabled: !!year2,
    });

    return {
        metrics1: metrics1Query.data,
        metrics2: metrics2Query.data,
        isLoading: metrics1Query.isLoading || metrics2Query.isLoading,
        isError: metrics1Query.isError || metrics2Query.isError,
    };
};

export function ComparisonContent() {
    const [year1] = useQueryState('year1', parseAsInteger.withDefault(new Date().getFullYear()));
    const [year2] = useQueryState('year2', parseAsInteger.withDefault(new Date().getFullYear() - 1));
    const { metrics1, metrics2, isLoading, isError } = useYearMetrics(year1, year2);

    if (isLoading) return <ComparisonContentSkeleton />;
    if (!metrics1 || !metrics2 || isError) return <ComparisonContentError />;

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
    const handleRetry = () => {
        window.location.reload();
    };

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
                    <Button onClick={handleRetry} className="w-full" size="default">
                        <RefreshCw className="mr-2 size-4" />
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};