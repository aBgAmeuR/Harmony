'use client';

import { ReusableLineChart } from "@repo/ui/components/charts/line-chart";
import { Skeleton } from "@repo/ui/skeleton";

import { ChartCard, ChartCardContent, ChartCardHeader } from "~/components/charts/utils/chart-card";

import type { YearMetrics } from "../data/year-metrics";

type LineChartEvolutionProps = {
    metrics1: YearMetrics;
    metrics2: YearMetrics;
    className?: string;
};

export function LineChartEvolution({ metrics1, metrics2, className }: LineChartEvolutionProps) {
    const combinedData = metrics1.monthly.map((m1, index) => {
        const m2 = metrics2.monthly[index];
        return {
            month: m1.month,
            [`year${metrics1.year}`]: m1.listeningTime,
            [`year${metrics2.year}`]: m2 ? m2.listeningTime : 0,
        };
    });

    const config = {
        [`year${metrics1.year}`]: { label: `${metrics1.year}`, color: "var(--chart-1)" },
        [`year${metrics2.year}`]: { label: `${metrics2.year}`, color: "var(--chart-4)" },
    };

    return (
        <ChartCard className={className}>
            <ChartCardHeader
                title="Monthly Evolution"
                description="Showing the evolution of listening time over time"
                showSeparator={true}
            />
            <ChartCardContent>
                <ReusableLineChart
                    data={combinedData}
                    className="aspect-[4/1]"
                    xAxisDataKey="month"
                    lineDataKeys={[`year${metrics1.year}`, `year${metrics2.year}`]}
                    config={config}
                    showYAxis={false}
                    tooltipValueFormatter="hourSuffix"
                    showDots={true}
                    margin={{ left: 6, top: 6, right: 6, bottom: 0 }}
                />
            </ChartCardContent>
        </ChartCard>
    );
}

export function LineChartEvolutionSkeleton({ className }: { className?: string }) {
    return (
        <ChartCard className={className}>
            <ChartCardHeader
                title="Monthly Evolution"
                description="Showing the evolution of listening time over time"
                showSeparator={true}
            />
            <ChartCardContent>
                <div className="flex aspect-[4/1] items-center justify-center">
                    <Skeleton className="size-full" />
                </div>
            </ChartCardContent>
        </ChartCard>
    );
} 