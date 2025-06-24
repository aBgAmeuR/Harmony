"use client";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "@repo/ui/chart";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { cn } from "../../lib/utils";
import { BaseChartProps } from "./common";
import { getChartTooltipFormatter } from "./common/chart-tooltip-formatter";
import { getTickFormatter } from "./common/tick-formatters";
import { getTooltipFormatter } from "./common/tooltip-formatters";

export interface RadarChartProps extends BaseChartProps {
    angleAxisDataKey: string;
    radarDataKeys: string[];
}

export function ReusableRadarChart({
    data,
    angleAxisDataKey,
    radarDataKeys,
    config,
    tooltipLabelFormatter = "normal",
    tooltipValueFormatter = "normal",
    className,
}: RadarChartProps) {
    return (
        <ChartContainer config={config} className={cn("aspect-square min-w-60 w-full", className)}>
            <RadarChart data={data} margin={{ top: 18, right: 18, bottom: 18, left: 18 }}>
                <ChartTooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            labelFormatter={(label, payload) => getTooltipFormatter(tooltipLabelFormatter, label, payload, null)}
                            formatter={getChartTooltipFormatter(tooltipValueFormatter)}
                        />
                    }
                />
                <PolarAngleAxis
                    dataKey={angleAxisDataKey}
                    width={50}
                    tickFormatter={getTickFormatter("normal")}
                />
                <PolarGrid />
                {radarDataKeys.map((key) => (
                    <Radar
                        key={key}
                        dataKey={key}
                        fill={`var(--color-${key})`}
                        fillOpacity={0.6}
                        dot={{ r: 4, fillOpacity: 1 }}
                    />
                ))}
            </RadarChart>
        </ChartContainer>
    );
}
