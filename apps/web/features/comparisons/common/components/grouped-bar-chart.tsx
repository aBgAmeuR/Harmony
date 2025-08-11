import { ReusableBarChart } from "@repo/ui/components/charts/bar-chart";
import { Skeleton } from "@repo/ui/skeleton";

import { ChartCard, ChartCardContent, ChartCardHeader } from "~/components/charts/utils/chart-card";

import type { ComparisonMetrics } from "../types";

type GroupedBarChartProps = {
    metrics1: ComparisonMetrics
    metrics2: ComparisonMetrics
    className?: string;
};

export function ComparisonGroupedBarChart({ metrics1, metrics2, className }: GroupedBarChartProps) {
    const data = [
        { metric: "Listening Time (min)", value1: metrics1.totalListeningTime, value2: metrics2.totalListeningTime },
        { metric: "Total Streams", value1: metrics1.totalStreams, value2: metrics2.totalStreams },
    ];

    const config = {
        value1: { label: metrics1.label, color: "var(--chart-1)" },
        value2: { label: metrics2.label, color: "var(--chart-4)" },
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
                    barDataKeys={["value1", "value2"]}
                    config={config}
                    showYAxis={false}
                    className="h-full"
                />
            </ChartCardContent>
        </ChartCard>
    );
}

export function ComparisonGroupedBarChartSkeleton({ className }: { className?: string }) {
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