"use client";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@repo/ui/chart";
import type * as React from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartTooltipFormatter } from "./chart-tooltip-formatter";

export interface LineChartProps {
	data: any[];
	xAxisDataKey: string;
	lineDataKey: string;
	config: ChartConfig;
	tooltipLabelFormatter?: (value: string, payload: any) => React.ReactNode;
	tooltipValueFormatter?: React.ComponentProps<
		typeof ChartTooltipContent
	>["formatter"];
	className?: string;
	yAxisTickFormatter?: (value: any) => string;
	xAxisTickFormatter?: (value: any) => string;
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
	tooltipLabelFormatter,
	tooltipValueFormatter,
	className = "aspect-[10/3] w-full",
	yAxisTickFormatter,
	xAxisTickFormatter,
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
					tickFormatter={xAxisTickFormatter}
					dy={10}
				/>
				{showYAxis && (
					<YAxis
						tickLine={false}
						axisLine={false}
						ticks={[0, 1, 10, 20, 30, 40, 50]}
						tickFormatter={yAxisTickFormatter}
						reversed={yAxisReversed}
						domain={yAxisDomain}
					/>
				)}
				<ChartTooltip
					content={
						<ChartTooltipContent
							labelFormatter={tooltipLabelFormatter}
							formatter={tooltipValueFormatter}
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