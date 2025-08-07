"use client";

import { CircleAlert } from "lucide-react";

import { Button } from "@repo/ui/button";
import type { ChartTooltipFormatter } from "@repo/ui/components/charts/common/chart-tooltip-formatter";

import type { ComparisonMetrics } from "../types";
import { ComparisonGroupedBarChart, ComparisonGroupedBarChartSkeleton } from "./grouped-bar-chart";
import { ComparisonLineChartEvolution, ComparisonLineChartEvolutionSkeleton } from "./line-chart-evolution";
import { ComparisonStatsCards, ComparisonStatsCardsSkeleton } from "./stats-cards";
import { ComparisonTopItemsCard, ComparisonTopItemsCardSkeleton } from "./top-items-card";

type ComparisonLayoutProps = {
    metrics1: ComparisonMetrics
    metrics2: ComparisonMetrics
    isLoading: boolean
    isError: boolean
    titles: { title1: string, title2: string }
    labels: string[]
    lineChartTooltipValueFormatter?: ChartTooltipFormatter;
    fillMissingMonths?: boolean;
}

export function ComparisonLayout({
    metrics1,
    metrics2,
    isLoading,
    isError,
    titles,
    labels,
    lineChartTooltipValueFormatter,
    fillMissingMonths
}: ComparisonLayoutProps) {
    if (isLoading) return <ComparisonLayoutSkeleton labels={labels} titles={titles} />;
    if (isError) return <ComparisonLayoutError />;

    return (
        <div className="space-y-4">
            <ComparisonStatsCards metrics1={metrics1} metrics2={metrics2} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                <ComparisonLineChartEvolution
                    metrics1={metrics1}
                    metrics2={metrics2}
                    className="lg:col-span-3"
                    tooltipValueFormatter={lineChartTooltipValueFormatter}
                    fillMissingMonths={fillMissingMonths}
                />
                <ComparisonGroupedBarChart metrics1={metrics1} metrics2={metrics2} className="w-full" />
            </div>
            <ComparisonTopItemsCard metrics1={metrics1} metrics2={metrics2} titles={titles} />
        </div>
    );
}

type ComparisonLayoutSkeletonProps = {
    labels: string[]
    titles: { title1: string, title2: string }
}

export const ComparisonLayoutSkeleton = ({ labels, titles }: ComparisonLayoutSkeletonProps) => {
    return (
        <div className="space-y-4">
            <ComparisonStatsCardsSkeleton labels={labels} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                <ComparisonLineChartEvolutionSkeleton className="lg:col-span-3" />
                <ComparisonGroupedBarChartSkeleton className="w-full" />
            </div>
            <ComparisonTopItemsCardSkeleton titles={titles} />
        </div>
    );
}

const ComparisonLayoutError = () => {
    return (
        <div className="rounded-lg border border-border bg-background p-4 shadow-black/5 shadow-lg">
            <div className="flex gap-2">
                <div className="flex grow gap-3">
                    <CircleAlert
                        className="mt-0.5 shrink-0 text-red-500"
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                    <div className="flex grow flex-col gap-3">
                        <div className="space-y-1">
                            <p className="font-medium text-sm">
                                We couldn&lsquo;t complete your request!
                            </p>
                            <p className="text-muted-foreground text-sm">
                                We encountered an error while loading your year-over-year comparison data.
                                This might be due to a temporary network issue or server problem.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                onClick={() => typeof window !== "undefined" && window.location.reload()}
                            >
                                Retry
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}