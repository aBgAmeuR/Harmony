'use client';

import { useState } from "react";

import { ReusableBarChart } from "@repo/ui/components/charts/bar-chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select";

import { ChartCard, ChartCardContent, ChartCardHeader } from "~/components/charts/utils/chart-card";

import type { YearMetrics } from "../data/year-metrics";

type GroupedBarChartProps = {
    metrics1: YearMetrics;
    metrics2: YearMetrics;
};

type Unit = "seconds" | "minutes" | "hours" | "days";

function prepareData(metrics1: YearMetrics, metrics2: YearMetrics, unit: Unit) {
    return [
        {
            metric: `Listening Time (${unit})`,
            year1: Math.round(metrics1.totalListeningTime / (unit === "seconds" ? 1000 : unit === "minutes" ? 60000 : unit === "hours" ? 3600000 : 86400000)),
            year2: Math.round(metrics2.totalListeningTime / (unit === "seconds" ? 1000 : unit === "minutes" ? 60000 : unit === "hours" ? 3600000 : 86400000))
        },
        {
            metric: 'Total Streams',
            year1: metrics1.numStreams,
            year2: metrics2.numStreams
        },
    ];
}

export function GroupedBarChart({ metrics1, metrics2 }: GroupedBarChartProps) {
    const [unit, setUnit] = useState<Unit>("minutes");
    const data = prepareData(metrics1, metrics2, unit);

    const config = {
        year1: { label: metrics1.year.toString(), color: "var(--chart-1)" },
        year2: { label: metrics2.year.toString(), color: "var(--chart-4)" },
    };

    return (
        <ChartCard>
            <ChartCardHeader
                title="Listening Time Comparison"
                description="Comparing listening time between two years"
                showSeparator={true}
            >
                <div className="flex flex-col justify-center border-t px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:border-t-0 sm:px-6 sm:py-0">
                    <Select value={unit} onValueChange={(value) => setUnit(value as Unit)}>
                        <SelectTrigger size="sm" className="">
                            <SelectValue placeholder="Select a unit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="seconds">Seconds</SelectItem>
                            <SelectItem value="minutes">Minutes</SelectItem>
                            <SelectItem value="hours">Hours</SelectItem>
                            <SelectItem value="days">Days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </ChartCardHeader>
            <ChartCardContent>
                <ReusableBarChart
                    data={data}
                    xAxisDataKey="metric"
                    barDataKeys={["year1", "year2"]}
                    config={config}
                    className="h-[200px]"
                />
            </ChartCardContent>
        </ChartCard>
    );
} 