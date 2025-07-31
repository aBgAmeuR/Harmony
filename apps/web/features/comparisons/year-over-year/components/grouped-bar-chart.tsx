'use client';

import { ReusableBarChart } from "@repo/ui/components/charts/bar-chart";
import { Skeleton } from "@repo/ui/skeleton";

import { ChartCard, ChartCardContent, ChartCardHeader } from "~/components/charts/utils/chart-card";

import type { YearMetrics } from "../data/year-metrics";

type GroupedBarChartProps = {
    metrics1: YearMetrics;
    metrics2: YearMetrics;
    className?: string;
};

function prepareData(metrics1: YearMetrics, metrics2: YearMetrics) {
    return [
        {
            metric: `Listening Time (minutes)`,
            year1: Math.round(metrics1.totalListeningTime / 60000),
            year2: Math.round(metrics2.totalListeningTime / 60000)
        },
        {
            metric: 'Total Streams',
            year1: metrics1.numStreams,
            year2: metrics2.numStreams
        },
    ];
}

export function GroupedBarChart({ metrics1, metrics2, className }: GroupedBarChartProps) {
    const data = prepareData(metrics1, metrics2);

    const config = {
        year1: { label: metrics1.year.toString(), color: "var(--chart-1)" },
        year2: { label: metrics2.year.toString(), color: "var(--chart-4)" },
    };

    return (
        <ChartCard className={className}>
            <ChartCardHeader
                title="Listening Time Comparison"
                description="Compare two years"
                showSeparator={true}
            />
            <ChartCardContent className="flex-1">
                <ReusableBarChart
                    data={data}
                    xAxisDataKey="metric"
                    barDataKeys={["year1", "year2"]}
                    config={config}
                    showYAxis={false}
                    className="h-full"
                />
            </ChartCardContent>
        </ChartCard>
    );
}

export function GroupedBarChartSkeleton({ className }: { className?: string }) {
    return (
        <ChartCard className={className}>
            <ChartCardHeader
                title="Listening Time Comparison"
                description="Compare two years"
                showSeparator={true}
            />
            <ChartCardContent className="flex-1">
                <Skeleton className="size-full" />
            </ChartCardContent>
        </ChartCard>
    );
} 