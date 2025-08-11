"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@repo/ui/chart";

import { cn } from "../../lib/utils";
import type { BaseChartProps } from "./common";
import { getChartTooltipFormatter } from "./common/chart-tooltip-formatter";
import { getTooltipFormatter } from "./common/tooltip-formatters";

export interface RadialBarChartProps extends BaseChartProps {
	barDataKeys: string[];
	percentage?: number;
	centerLabel?: string;
}

export function ReusableRadialBarChart({
	data,
	barDataKeys,
	config,
	tooltipLabelFormatter = "normal",
	tooltipValueFormatter = "normal",
	className,
	percentage,
	centerLabel,
}: RadialBarChartProps) {
	return (
		<ChartContainer
			config={config}
			className={cn("aspect-square w-full min-w-60", className)}
		>
			<RadialBarChart
				data={data}
				endAngle={180}
				innerRadius={80}
				outerRadius={130}
			>
				<ChartTooltip
					cursor={false}
					content={
						<ChartTooltipContent
							hideLabel
							labelFormatter={(label, payload) =>
								getTooltipFormatter(tooltipLabelFormatter, label, payload, null)
							}
							formatter={getChartTooltipFormatter(tooltipValueFormatter)}
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
											className="fill-foreground font-bold text-2xl"
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
						className="stroke-2 stroke-transparent"
					/>
				))}
			</RadialBarChart>
		</ChartContainer>
	);
}
