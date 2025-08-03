'use client';

import { ReusableLineChart } from "@repo/ui/components/charts/line-chart";
import { Skeleton } from "@repo/ui/skeleton";

import { ChartCard, ChartCardContent, ChartCardHeader } from "~/components/charts/utils/chart-card";

export type LineChartDataPoint = {
    [key: string]: string | number;
};

type LineChartEvolutionProps = {
    data: LineChartDataPoint[];
    xAxisDataKey: string;
    lineDataKeys: string[];
    config: Record<string, { label: string; color: string }>;
    title: string;
    description: string;
    className?: string;
};

export function LineChartEvolution({
    data,
    xAxisDataKey,
    lineDataKeys,
    config,
    title,
    description,
    className
}: LineChartEvolutionProps) {
    return (
        <ChartCard className={className}>
            <ChartCardHeader
                title={title}
                description={description}
                showSeparator={true}
            />
            <ChartCardContent>
                <ReusableLineChart
                    data={data}
                    className="aspect-[4/1]"
                    xAxisDataKey={xAxisDataKey}
                    lineDataKeys={lineDataKeys}
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

export function LineChartEvolutionSkeleton({ title, description, className }: { title: string; description: string; className?: string }) {
    return (
        <ChartCard className={className}>
            <ChartCardHeader
                title={title}
                description={description}
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