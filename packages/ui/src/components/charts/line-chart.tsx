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
}: LineChartProps) {
	return (
		<ChartContainer config={config} className={className}>
			<LineChart data={data} margin={{ left: -38, top: 6 }}>
				<CartesianGrid vertical={false} strokeDasharray="3 3" />
				<XAxis
					dataKey={xAxisDataKey}
					tickLine={false}
					axisLine={false}
					tickMargin={2}
					tickFormatter={xAxisTickFormatter}
				/>
				{showYAxis && (
					<YAxis
						tickLine={false}
						axisLine={false}
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
					cursor={false}
				/>
				<Line
					type="monotone"
					dataKey={lineDataKey}
					stroke={`var(--color-${lineDataKey})`}
					strokeWidth={2}
					dot={{ r: 4 }}
					activeDot={{ r: 6 }}
				/>
			</LineChart>
		</ChartContainer>
	);
} 