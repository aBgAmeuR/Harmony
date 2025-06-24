"use client";

import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent
} from "@repo/ui/chart";
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
import { cn } from "../../lib/utils";
import { AxisTickFormatters, BaseChartProps } from "./common";
import { getChartTooltipFormatter } from "./common/chart-tooltip-formatter";
import { getTickFormatter, TickFormatterValues } from "./common/tick-formatters";
import { getTooltipFormatter } from "./common/tooltip-formatters";

export interface BarChartProps extends BaseChartProps, AxisTickFormatters {
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
	config,
	tooltipLabelFormatter = "normal",
	tooltipValueFormatter = "normal",
	className,
	yAxisTickFormatter = "normal",
	xAxisTickFormatter = "normal",
	showBarLabels = false,
	showYAxis = true,
	barLabelFormatter,
	barRadius = 4,
	labelData,
}: BarChartProps) {
	return (
		<ChartContainer config={config} className={cn("aspect-[10/3] w-full", className)}>
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
							formatter={getChartTooltipFormatter(tooltipValueFormatter)}
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
