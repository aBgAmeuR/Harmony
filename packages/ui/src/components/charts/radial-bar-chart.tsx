"use client";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@repo/ui/chart";
import type * as React from "react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { getTooltipFormatter, TooltipFormatterValues } from "./tooltip-formatters";
import { ChartTooltipFormatter } from "./chart-tooltip-formatter";

export interface RadialBarChartProps {
	data: any[];
	barDataKeys: string[];
	config: ChartConfig;
	endAngle?: number;
	innerRadius?: number;
	outerRadius?: number;
	tooltipLabelFormatter?: TooltipFormatterValues;
	tooltipValueFormatter?: React.ComponentProps<
		typeof ChartTooltipContent
	>["formatter"];
	className?: string;
	percentage?: number;
	centerLabel?: string;
}

export function ReusableRadialBarChart({
	data,
	barDataKeys,
	config,
	endAngle = 180,
	innerRadius = 80,
	outerRadius = 130,
	tooltipLabelFormatter = "normal",
	tooltipValueFormatter = ChartTooltipFormatter,
	className = "aspect-square min-w-60 w-full",
	percentage,
	centerLabel,
}: RadialBarChartProps) {
	return (
		<ChartContainer config={config} className={className}>
			<RadialBarChart
				data={data}
				endAngle={endAngle}
				innerRadius={innerRadius}
				outerRadius={outerRadius}
			>
				<ChartTooltip
					cursor={false}
					content={
						<ChartTooltipContent
							hideLabel
							labelFormatter={(label, payload) => getTooltipFormatter(tooltipLabelFormatter, label, payload, null)}
							formatter={tooltipValueFormatter}
						/>
					}
				/>
				<PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
					{percentage && centerLabel && (
						<Label
							content={({ viewBox }) =>
								viewBox && "cx" in viewBox && "cy" in viewBox ? (
									<text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
										<tspan
											x={viewBox.cx}
											y={(viewBox.cy || 0) - 16}
											className="fill-foreground text-2xl font-bold"
										>
											{`${percentage}%`}
										</tspan>
										<tspan
											x={viewBox.cx}
											y={(viewBox.cy || 0) + 4}
											className="fill-muted-foreground"
										>
											{centerLabel}
										</tspan>
									</text>
								) : null
							}
						/>
					)}
				</PolarRadiusAxis>
				{barDataKeys.map((key) => (
					<RadialBar
						key={key}
						dataKey={key}
						stackId="a"
						cornerRadius={5}
						fill={`var(--color-${key})`}
						className="stroke-transparent stroke-2"
					/>
				))}
			</RadialBarChart>
		</ChartContainer>
	);
}
