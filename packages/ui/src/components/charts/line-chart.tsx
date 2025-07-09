"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@repo/ui/chart";

import { cn } from "../../lib/utils";
import type { AxisTickFormatters, BaseChartProps } from "./common";
import { getChartTooltipFormatter } from "./common/chart-tooltip-formatter";
import { getTickFormatter } from "./common/tick-formatters";
import { getTooltipFormatter } from "./common/tooltip-formatters";

export interface LineChartProps extends BaseChartProps, AxisTickFormatters {
	xAxisDataKey: string;
	lineDataKey: string;
	className?: string;
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
	tooltipValueFormatter = "normal",
	className,
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
		<ChartContainer
			config={config}
			className={cn("aspect-[10/3] w-full", className)}
		>
			<LineChart
				data={data}
				margin={{ left: -38, top: 6, right: 6 }}
				syncId={syncId}
			>
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
							labelFormatter={(label, payload) =>
								getTooltipFormatter(tooltipLabelFormatter, label, payload, null)
							}
							formatter={getChartTooltipFormatter(tooltipValueFormatter)}
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
