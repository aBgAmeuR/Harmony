"use client";

import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@repo/ui/chart";
import type * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { createGradientDefs } from "./chart-color-utils";
import { ChartTooltipFormatter } from "./chart-tooltip-formatter";
import { axisTickFormatters } from "./axis-tick-formatters";
import { chartLabelsFormatter } from "./chart-label-formatter";

export interface AreaChartProps {
	data: any[];
	xAxisDataKey: string;
	areaDataKeys: string[];
	stacked?: boolean;
	config: ChartConfig;
	tooltipLabelFormatter?: keyof typeof chartLabelsFormatter;
	tooltipValueFormatter?: React.ComponentProps<
		typeof ChartTooltipContent
	>["formatter"];
	className?: string;
	yAxisTickFormatter?: keyof typeof axisTickFormatters;
	xAxisTickFormatter?: keyof typeof axisTickFormatters;
	showLegend?: boolean;
	showYAxis?: boolean;
}

export function ReusableAreaChart({
	data,
	xAxisDataKey,
	areaDataKeys,
	stacked = false,
	config,
	tooltipLabelFormatter,
	tooltipValueFormatter = ChartTooltipFormatter,
	className = "aspect-[10/3] w-full",
	yAxisTickFormatter,
	xAxisTickFormatter,
	showLegend = false,
	showYAxis = true,
}: AreaChartProps) {
	// Create array of chart items from config for gradient defs
	const chartItems = areaDataKeys.map((key) => ({
		label: key,
		color: config[key]?.color || `var(--chart-${key})`,
	}));

	return (
		<ChartContainer config={config} className={className}>
			<AreaChart data={data}>
				{createGradientDefs(chartItems)}
				<CartesianGrid vertical={false} strokeDasharray="3 3" />
				<XAxis
					dataKey={xAxisDataKey}
					tickLine={false}
					axisLine={false}
					tickMargin={8}
					minTickGap={32}
					tickFormatter={xAxisTickFormatter ? axisTickFormatters[xAxisTickFormatter] : undefined}
				/>
				{showYAxis && (
					<YAxis
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						tickFormatter={yAxisTickFormatter ? axisTickFormatters[yAxisTickFormatter] : undefined}
					/>
				)}
				<ChartTooltip
					content={
						<ChartTooltipContent
							labelFormatter={(label, payload) => tooltipLabelFormatter ? chartLabelsFormatter[tooltipLabelFormatter](label, payload, null) : undefined}
							formatter={tooltipValueFormatter}
						/>
					}
					cursor={false}
				/>

				{areaDataKeys.map((key) => (
					<Area
						key={key}
						type="monotone"
						dataKey={key}
						stackId={stacked ? "1" : undefined}
						stroke={`var(--color-${key})`}
						fill={`url(#fill${key})`}
					/>
				))}

				{showLegend && <ChartLegend content={<ChartLegendContent />} />}
			</AreaChart>
		</ChartContainer>
	);
}
