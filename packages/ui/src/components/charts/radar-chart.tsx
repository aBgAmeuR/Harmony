"use client";

import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@repo/ui/chart";
import type * as React from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { ChartTooltipFormatter } from "./chart-tooltip-formatter";
import { getTickFormatter, TickFormatterValues } from "./tick-formatters";
import { getTooltipFormatter, TooltipFormatterValues } from "./tooltip-formatters";

export interface RadarChartProps {
    data: any[];
    angleAxisDataKey: string;
    radarDataKeys: string[];
    config: ChartConfig;
    tooltipLabelFormatter?: TooltipFormatterValues;
    tooltipValueFormatter?: React.ComponentProps<
        typeof ChartTooltipContent
    >["formatter"];
    className?: string;
    margin?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
    angleAxisTickFormatter?: TickFormatterValues;
    angleAxisWidth?: number;
    fillOpacity?: number;
    dotRadius?: number;
    showDots?: boolean;
    showGrid?: boolean;
    labelData?: any;
}

export function ReusableRadarChart({
    data,
    angleAxisDataKey,
    radarDataKeys,
    config,
    tooltipLabelFormatter = "normal",
    tooltipValueFormatter = ChartTooltipFormatter,
    className = "aspect-square min-w-60 w-full",
    margin = { top: 18, right: 18, bottom: 18, left: 18 },
    angleAxisTickFormatter = "normal",
    angleAxisWidth = 50,
    fillOpacity = 0.6,
    dotRadius = 4,
    showDots = true,
    showGrid = true,
    labelData,
}: RadarChartProps) {
    return (
        <ChartContainer config={config} className={className}>
            <RadarChart data={data} margin={margin}>
                <ChartTooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            labelFormatter={(label, payload) => getTooltipFormatter(tooltipLabelFormatter, label, payload, labelData)}
                            formatter={tooltipValueFormatter}
                        />
                    }
                />
                <PolarAngleAxis
                    dataKey={angleAxisDataKey}
                    width={angleAxisWidth}
                    tickFormatter={getTickFormatter(angleAxisTickFormatter)}
                />
                {showGrid && <PolarGrid />}
                {radarDataKeys.map((key) => (
                    <Radar
                        key={key}
                        dataKey={key}
                        fill={`var(--color-${key})`}
                        fillOpacity={fillOpacity}
                        dot={showDots ? { r: dotRadius, fillOpacity: 1 } : false}
                    />
                ))}
            </RadarChart>
        </ChartContainer>
    );
}
