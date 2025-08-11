"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@repo/ui/chart";

import { cn } from "../../lib/utils";
import type { AxisTickFormatters, BaseChartProps } from "./common";
import { createGradientDefs } from "./common/chart-color-utils";
import { getChartTooltipFormatter } from "./common/chart-tooltip-formatter";
import { getTickFormatter } from "./common/tick-formatters";
import { getTooltipFormatter } from "./common/tooltip-formatters";

export interface AreaChartProps extends BaseChartProps, AxisTickFormatters {
	xAxisDataKey: string;
	areaDataKeys: string[];
	stacked?: boolean;
	showLegend?: boolean;
	showYAxis?: boolean;
}

export function ReusableAreaChart({
	data,
	xAxisDataKey,
	areaDataKeys,
	config,
	className,
	stacked = false,
	tooltipLabelFormatter = "normal",
	tooltipValueFormatter = "normal",
	yAxisTickFormatter = "normal",
	xAxisTickFormatter = "normal",
	showLegend = false,
	showYAxis = true,
}: AreaChartProps) {
	// Create array of chart items from config for gradient defs
	const chartItems = areaDataKeys.map((key) => ({
		label: key,
		color: config[key]?.color || `var(--chart-${key})`,
	}));

	return (
		<ChartContainer
			config={config}
			className={cn("aspect-[10/3] w-full", className)}
		>
			<AreaChart data={data}>
				{createGradientDefs(chartItems)}
				<CartesianGrid vertical={false} strokeDasharray="3 3" />
				<XAxis
					dataKey={xAxisDataKey}
					tickLine={false}
					axisLine={false}
					tickMargin={8}
					minTickGap={32}
					tickFormatter={getTickFormatter(xAxisTickFormatter)}
				/>
				{showYAxis && (
					<YAxis
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						tickFormatter={getTickFormatter(yAxisTickFormatter)}
					/>
				)}
				<ChartTooltip
					content={
						<ChartTooltipContent
							labelFormatter={(label, payload) =>
								getTooltipFormatter(tooltipLabelFormatter, label, payload, null)
							}
							formatter={getChartTooltipFormatter(tooltipValueFormatter)}
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
