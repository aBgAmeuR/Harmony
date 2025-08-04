import { ReusableLineChart } from "@repo/ui/components/charts/line-chart";
import { Skeleton } from "@repo/ui/skeleton";

import { ChartCard, ChartCardContent, ChartCardHeader } from "~/components/charts/utils/chart-card";

import type { ComparisonMetrics } from "../types";


type ComparisonLineChartEvolutionProps = {
    metrics1: ComparisonMetrics
    metrics2: ComparisonMetrics
    className?: string;
};

export function ComparisonLineChartEvolution({
    metrics1,
    metrics2,
    className
}: ComparisonLineChartEvolutionProps) {
    const data = metrics1.monthly.map((m1, index) => ({
        month: m1.month,
        value1: m1.listeningTime,
        value2: metrics2.monthly[index]?.listeningTime ?? 0,
    }));

    const config = {
        value1: { label: metrics1.label, color: "var(--chart-1)" },
        value2: { label: metrics2.label, color: "var(--chart-4)" },
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
                    data={data}
                    className="aspect-[4/1]"
                    xAxisDataKey="month"
                    lineDataKeys={["value1", "value2"]}
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

export function ComparisonLineChartEvolutionSkeleton({ className }: { className?: string }) {
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