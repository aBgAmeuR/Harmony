"use client";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@repo/ui/chart";
import type * as React from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Label,
	LabelList,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts";
import { ChartTooltipFormatter } from "./chart-tooltip-formatter";
import { getTickFormatter, TickFormatterValues } from "./tick-formatters";
import { getTooltipFormatter, TooltipFormatterValues } from "./tooltip-formatters";

export interface BarChartProps {
	data: any[];
	xAxisDataKey: string;
	barDataKey: string;
	referenceLine?: {
		value: number;
		label: string;
		position?:
		| "top"
		| "insideTop"
		| "bottom"
		| "insideBottom"
		| "insideBottomLeft";
	};
	config?: ChartConfig;
	tooltipLabelFormatter?: TooltipFormatterValues;
	tooltipValueFormatter?: React.ComponentProps<
		typeof ChartTooltipContent
	>["formatter"];
	className?: string;
	yAxisTickFormatter?: TickFormatterValues;
	xAxisTickFormatter?: TickFormatterValues;
	showBarLabels?: boolean;
	showYAxis?: boolean;
	barLabelFormatter?: TickFormatterValues;
	barRadius?: number;
	labelData?: any;
}

export function ReusableBarChart({
	data,
	xAxisDataKey,
	barDataKey,
	referenceLine,
	config = {
		[barDataKey]: {
			label: "Value",
			color: "var(--chart-1)",
		},
	} as ChartConfig,
	tooltipLabelFormatter = "normal",
	tooltipValueFormatter = ChartTooltipFormatter,
	className = "aspect-[10/3] w-full",
	yAxisTickFormatter = "normal",
	xAxisTickFormatter = "normal",
	showBarLabels = false,
	showYAxis = true,
	barLabelFormatter,
	barRadius = 4,
	labelData,
}: BarChartProps) {
	return (
		<ChartContainer config={config} className={className}>
			<BarChart accessibilityLayer data={data} margin={{ top: 24 }}>
				<CartesianGrid vertical={false} strokeDasharray="3 3" />
				<XAxis
					dataKey={xAxisDataKey}
					tickLine={false}
					axisLine={false}
					tickMargin={8}
					tickFormatter={getTickFormatter(xAxisTickFormatter)}
				/>
				{showYAxis && (
					<YAxis
						tickLine={false}
						axisLine={false}
						tickFormatter={getTickFormatter(yAxisTickFormatter)}
					/>
				)}
				<ChartTooltip
					content={
						<ChartTooltipContent
							labelFormatter={(label, payload) => getTooltipFormatter(tooltipLabelFormatter, label, payload, labelData)}
							formatter={tooltipValueFormatter}
						/>
					}
					cursor={false}
				/>
				<Bar
					dataKey={barDataKey}
					fill={`var(--color-${barDataKey})`}
					radius={barRadius}
				>
					{showBarLabels && (
						<LabelList
							position="top"
							offset={12}
							className="fill-foreground"
							fontSize={12}
							formatter={getTickFormatter(barLabelFormatter)}
						/>
					)}
				</Bar>

				{referenceLine && (
					<ReferenceLine
						y={referenceLine.value}
						stroke="red"
						strokeDasharray="3 3"
					>
						<Label
							value={referenceLine.label}
							position={referenceLine.position || "insideBottomLeft"}
							fill="red"
						/>
					</ReferenceLine>
				)}
			</BarChart>
		</ChartContainer>
	);
}
