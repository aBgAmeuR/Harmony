"use client";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@repo/ui/chart";
import type * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { getTickFormatter, TickFormatterValues } from "./tick-formatters";
import { getTooltipFormatter, TooltipFormatterValues } from "./tooltip-formatters";
import { ChartTooltipFormatter } from "./chart-tooltip-formatter";

export interface LineChartProps {
	data: any[];
	xAxisDataKey: string;
	lineDataKey: string;
	config: ChartConfig;
	tooltipLabelFormatter?: TooltipFormatterValues;
	tooltipValueFormatter?: React.ComponentProps<
		typeof ChartTooltipContent
	>["formatter"] | null;
	className?: string;
	yAxisTickFormatter?: TickFormatterValues;
	xAxisTickFormatter?: TickFormatterValues;
	yAxisReversed?: boolean;
	yAxisDomain?: [number | string, number | string];
	showYAxis?: boolean;
	showDots?: boolean;
	cursor?: boolean;
	syncId?: string;
}

export function ReusableLineChart({
	data,
	xAxisDataKey,
	lineDataKey,
	config,
	tooltipLabelFormatter = "normal",
	tooltipValueFormatter = ChartTooltipFormatter,
	className = "aspect-[10/3] w-full",
	yAxisTickFormatter = "normal",
	xAxisTickFormatter = "normal",
	yAxisReversed = false,
	yAxisDomain,
	showYAxis = true,
	showDots = false,
	cursor = false,
	syncId,
}: LineChartProps) {
	return (
		<ChartContainer config={config} className={className}>
			<LineChart data={data} margin={{ left: -38, top: 6, right: 6 }} syncId={syncId}>
				<CartesianGrid vertical={false} strokeDasharray="3 3" />
				<XAxis
					dataKey={xAxisDataKey}
					tickLine={false}
					axisLine={false}
					tickMargin={2}
					tickFormatter={getTickFormatter(xAxisTickFormatter)}
					dy={10}
				/>
				{showYAxis && (
					<YAxis
						tickLine={false}
						axisLine={false}
						ticks={[0, 1, 10, 20, 30, 40, 50]}
						tickFormatter={getTickFormatter(yAxisTickFormatter)}
						reversed={yAxisReversed}
						domain={yAxisDomain}
					/>
				)}
				<ChartTooltip
					content={
						<ChartTooltipContent
							labelFormatter={(label, payload) => getTooltipFormatter(tooltipLabelFormatter, label, payload, null)}
							formatter={tooltipValueFormatter ? tooltipValueFormatter : undefined}
						/>
					}
					cursor={cursor}
				/>
				<Line
					type="natural"
					dataKey={lineDataKey}
					stroke={`var(--color-${lineDataKey})`}
					strokeWidth={2}
					dot={showDots ? { fill: `var(--color-${lineDataKey})` } : false}
					activeDot={showDots ? { r: 6 } : { r: 4 }}
				/>
			</LineChart>
		</ChartContainer>
	);
} 