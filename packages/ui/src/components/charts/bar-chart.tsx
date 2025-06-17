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
import { chartLabelsFormatter } from "./chart-label-formatter";
import { axisTickFormatters } from "./axis-tick-formatters";

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
	tooltipLabelFormatter?: keyof typeof chartLabelsFormatter;
	tooltipValueFormatter?: React.ComponentProps<
		typeof ChartTooltipContent
	>["formatter"];
	className?: string;
	yAxisTickFormatter?: keyof typeof axisTickFormatters;
	xAxisTickFormatter?: keyof typeof axisTickFormatters;
	showBarLabels?: boolean;
	showYAxis?: boolean;
	barLabelFormatter?: keyof typeof axisTickFormatters;
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
	tooltipLabelFormatter,
	tooltipValueFormatter = ChartTooltipFormatter,
	className = "aspect-[10/3] w-full",
	yAxisTickFormatter,
	xAxisTickFormatter,
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
					tickFormatter={xAxisTickFormatter ? axisTickFormatters[xAxisTickFormatter] : undefined}
				/>
				{showYAxis && (
					<YAxis
						tickLine={false}
						axisLine={false}
						tickFormatter={yAxisTickFormatter ? axisTickFormatters[yAxisTickFormatter] : undefined}
					/>
				)}
				<ChartTooltip
					content={
						<ChartTooltipContent
							labelFormatter={(label, payload) => tooltipLabelFormatter ? chartLabelsFormatter[tooltipLabelFormatter](label, payload, labelData) : undefined}
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
							formatter={barLabelFormatter ? axisTickFormatters[barLabelFormatter] : undefined}
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
