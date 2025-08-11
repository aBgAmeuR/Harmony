"use client";

import {
	CartesianGrid,
	type DotProps,
	Line,
	LineChart,
	XAxis,
	YAxis,
} from "recharts";

import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@repo/ui/chart";
import { useScreenSize } from "@repo/ui/hooks/use-screen-size";

import type { AxisTickFormatters, BaseChartProps } from "./common";
import { getChartTooltipFormatter } from "./common/chart-tooltip-formatter";
import { getTickFormatter } from "./common/tick-formatters";
import { getTooltipFormatter } from "./common/tooltip-formatters";

export interface ChartRaceSeries {
	name: string;
	color: string;
	data: Record<string, any>[];
}

export interface ChartRaceProps
	extends Omit<BaseChartProps, "data">,
		AxisTickFormatters {
	series: ChartRaceSeries[];
	xAxisDataKey: string;
	yAxisDataKey: string;
	yAxisDomain?: [number, number];
	yAxisReversed?: boolean;
}

export function ChartRace({
	series,
	xAxisDataKey,
	yAxisDataKey,
	config,
	className,
	yAxisDomain = [1, 5],
	yAxisReversed = true,
	xAxisTickFormatter = "normal",
	yAxisTickFormatter = "normal",
	tooltipLabelFormatter = "normal",
	tooltipValueFormatter = "normal",
}: ChartRaceProps) {
	const chartRaceMonths = Array.from(
		new Set(series.flatMap((s) => s.data.map((d) => d.month))),
	)
		.sort(
			(a, b) => new Date(`${a}-01`).getTime() - new Date(`${b}-01`).getTime(),
		)
		.map((month) => ({ month }));

	return (
		<ChartContainer config={config} className={className}>
			<LineChart>
				<CartesianGrid vertical={false} strokeDasharray="3 3" />
				<XAxis
					dataKey={xAxisDataKey}
					type="category"
					allowDuplicatedCategory={false}
					padding={{ left: 32, right: 32 }}
					tickFormatter={getTickFormatter(xAxisTickFormatter)}
				/>
				<YAxis
					dataKey={yAxisDataKey}
					type="number"
					domain={yAxisDomain}
					tick={true}
					allowDecimals={false}
					reversed={yAxisReversed}
					padding={{ top: 32, bottom: 32 }}
					tickFormatter={getTickFormatter(yAxisTickFormatter)}
				/>
				<ChartTooltip
					cursor={true}
					itemSorter={(item) => Number(item.value)}
					content={
						<ChartTooltipContent
							labelFormatter={(label, payload) =>
								getTooltipFormatter(tooltipLabelFormatter, label, payload, null)
							}
							formatter={getChartTooltipFormatter(tooltipValueFormatter)}
						/>
					}
				/>
				<Line data={chartRaceMonths} isAnimationActive={false} />
				{series.map((s) => (
					<Line
						key={s.name}
						dataKey={yAxisDataKey}
						data={s.data}
						name={s.name}
						connectNulls={false}
						dot={({ key, ...rest }) => <CustomizedDot key={key} {...rest} />}
						activeDot={false}
						strokeWidth={2}
						stroke={s.color}
						isAnimationActive={false}
					/>
				))}
			</LineChart>
		</ChartContainer>
	);
}

interface CustomizedDotProps extends DotProps {
	payload?: { image?: string };
}
const CustomizedDot = ({ cx, cy, payload }: CustomizedDotProps) => {
	const screenSize = useScreenSize();
	if (!payload?.image || cx === undefined || cy === undefined) return null;
	let size: number;
	if (screenSize.lessThan("sm")) size = 16;
	else if (screenSize.lessThan("md")) size = 24;
	else if (screenSize.lessThan("lg")) size = 32;
	else if (screenSize.lessThan("xl")) size = 48;
	else size = 64;
	const xPos = cx - size / 2;
	const yPos = cy - size / 2;
	return (
		<svg
			x={xPos}
			y={yPos}
			width={size}
			height={size}
			viewBox={`0 0 ${size} ${size}`}
			xmlns="http://www.w3.org/2000/svg"
		>
			<image
				href={payload.image}
				x="0"
				y="0"
				width={size}
				height={size}
				clipPath={`circle(${size / 2}px at center)`}
			/>
		</svg>
	);
};

export type { DotProps as ChartRaceDotProps };
