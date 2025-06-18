"use client";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@repo/ui/chart";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import { colorizeData } from "./chart-color-utils";
import { ChartTooltipFormatter } from "./chart-tooltip-formatter";
import { getTooltipFormatter, TooltipFormatterValues } from "./tooltip-formatters";

export interface PieChartProps {
	data: any[];
	valueDataKey: string;
	nameKey: string;
	config?: ChartConfig;
	innerRadius?: number;
	tooltipLabelFormatter?: TooltipFormatterValues;
	tooltipValueFormatter?: React.ComponentProps<
		typeof ChartTooltipContent
	>["formatter"];
	className?: string;
	strokeWidth?: number;
	centerLabel?: string;
	centerValue?: string | number;
}

export function ReusablePieChart({
	data,
	valueDataKey,
	nameKey,
	config = {},
	innerRadius = 70,
	tooltipLabelFormatter = "normal",
	tooltipValueFormatter = ChartTooltipFormatter,
	className = "aspect-square min-w-60 w-full",
	strokeWidth = 5,
	centerLabel,
	centerValue,
}: PieChartProps) {
	const colorizedData = React.useMemo(() => colorizeData(data), [data]);

	return (
		<ChartContainer config={config} className={className}>
			<PieChart margin={{ top: -10, left: -10, right: -10, bottom: -10 }}>
				<ChartTooltip
					content={
						<ChartTooltipContent
							labelFormatter={(label, payload) => getTooltipFormatter(tooltipLabelFormatter, label, payload, null)}
							formatter={tooltipValueFormatter}
						/>
					}
					cursor={false}
				/>

				<Pie
					data={colorizedData}
					dataKey={valueDataKey}
					nameKey={nameKey}
					innerRadius={innerRadius}
					strokeWidth={strokeWidth}
				>
					{centerValue && centerLabel && (
						<Label
							content={({ viewBox }) =>
								viewBox && "cx" in viewBox && "cy" in viewBox ? (
									<text
										x={viewBox.cx}
										y={viewBox.cy}
										textAnchor="middle"
										dominantBaseline="middle"
									>
										<tspan
											x={viewBox.cx}
											y={viewBox.cy}
											className="fill-foreground text-3xl font-bold"
										>
											{centerValue}
										</tspan>
										<tspan
											x={viewBox.cx}
											y={(viewBox.cy || 0) + 24}
											className="fill-muted-foreground"
										>
											{centerLabel}
										</tspan>
									</text>
								) : null
							}
						/>
					)}
				</Pie>
			</PieChart>
		</ChartContainer>
	);
}
