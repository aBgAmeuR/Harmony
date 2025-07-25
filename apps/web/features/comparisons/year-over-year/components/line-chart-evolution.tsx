'use client';

import { ReusableLineChart } from "@repo/ui/components/charts/line-chart";

import { ChartCard, ChartCardContent, ChartCardHeader } from "~/components/charts/utils/chart-card";

import type { YearMetrics } from "../data/year-metrics";

type LineChartEvolutionProps = {
    metrics1: YearMetrics;
    metrics2: YearMetrics;
};

export function LineChartEvolution({ metrics1, metrics2 }: LineChartEvolutionProps) {
    const combinedData = metrics1.monthly.map((m1, index) => {
        const m2 = metrics2.monthly[index];
        return {
            month: m1.month,
            [`year${metrics1.year}`]: Math.round(m1.listeningTime / 3600000),
            [`year${metrics2.year}`]: m2 ? Math.round(m2.listeningTime / 3600000) : 0,
        };
    });

    const config = {
        [`year${metrics1.year}`]: { label: `${metrics1.year} (hours)`, color: "var(--chart-1)" },
        [`year${metrics2.year}`]: { label: `${metrics2.year} (hours)`, color: "var(--chart-4)" },
    };

    return (
        <ChartCard>
            <ChartCardHeader
                title="Monthly Evolution"
                description="Showing the evolution of listening time over time"
            />
            <ChartCardContent>
                <ReusableLineChart
                    data={combinedData}
                    xAxisDataKey="month"
                    lineDataKeys={[`year${metrics1.year}`, `year${metrics2.year}`]}
                    config={config}
                    showDots={true}
                />
            </ChartCardContent>
        </ChartCard>
    );
} 