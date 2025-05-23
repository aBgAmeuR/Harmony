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
	tooltipLabelFormatter?: (
		value: string,
		payload: any,
		context?: any,
	) => React.ReactNode;
	tooltipValueFormatter?: React.ComponentProps<
		typeof ChartTooltipContent
	>["formatter"];
	className?: string;
	yAxisTickFormatter?: (value: any) => string;
	xAxisTickFormatter?: (value: any) => string;
	showBarLabels?: boolean;
	showYAxis?: boolean;
	barLabelFormatter?: (value: any) => string;
	barRadius?: number;
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
	tooltipLabelFormatter,
	tooltipValueFormatter = ChartTooltipFormatter,
	className = "aspect-[10/3] w-full",
	yAxisTickFormatter,
	xAxisTickFormatter,
	showBarLabels = false,
	showYAxis = true,
	barLabelFormatter,
	barRadius = 4,
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
					tickFormatter={xAxisTickFormatter}
				/>
				{showYAxis && (
					<YAxis
						tickLine={false}
						axisLine={false}
						tickFormatter={yAxisTickFormatter}
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
							formatter={barLabelFormatter}
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
