'use client';

import { ReusableBarChart } from "@repo/ui/components/charts/bar-chart";
import { Skeleton } from "@repo/ui/skeleton";

import { ChartCard, ChartCardContent, ChartCardHeader } from "~/components/charts/utils/chart-card";

export type BarChartData = {
    metric: string;
    value1: number;
    value2: number;
};

type GroupedBarChartProps = {
    data: BarChartData[];
    label1: string;
    label2: string;
    title: string;
    description: string;
    className?: string;
};

export function GroupedBarChart({ data, label1, label2, title, description, className }: GroupedBarChartProps) {
    const chartData = data.map(item => ({
        metric: item.metric,
        value1: item.value1,
        value2: item.value2,
    }));

    const config = {
        value1: { label: label1, color: "var(--chart-1)" },
        value2: { label: label2, color: "var(--chart-4)" },
    };

    return (
        <ChartCard className={className}>
            <ChartCardHeader
                title={title}
                description={description}
                showSeparator={true}
            />
            <ChartCardContent className="flex-1">
                <ReusableBarChart
                    data={chartData}
                    xAxisDataKey="metric"
                    barDataKeys={["value1", "value2"]}
                    config={config}
                    showYAxis={false}
                    className="h-full"
                />
            </ChartCardContent>
        </ChartCard>
    );
}

export function GroupedBarChartSkeleton({ title, description, className }: { title: string; description: string; className?: string }) {
    return (
        <ChartCard className={className}>
            <ChartCardHeader
                title={title}
                description={description}
                showSeparator={true}
            />
            <ChartCardContent className="flex-1">
                <Skeleton className="size-full" />
            </ChartCardContent>
        </ChartCard>
    );
}