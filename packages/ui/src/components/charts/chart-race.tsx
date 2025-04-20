"use client";

import * as React from "react";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, type DotProps } from "recharts";
import { useScreenSize } from "@repo/ui/hooks/use-screen-size";

export interface ChartRaceSeries {
  name: string;
  color: string;
  data: Array<Record<string, any>>;
}

export interface ChartRaceProps {
  series: ChartRaceSeries[];
  xAxisDataKey: string;
  yAxisDataKey: string;
  config?: ChartConfig;
  className?: string;
  yAxisDomain?: [number, number];
  yAxisReversed?: boolean;
  xAxisTickFormatter?: (value: any) => string;
  yAxisTickFormatter?: (value: any) => string;
  tooltipLabelFormatter?: (value: string, payload: any) => React.ReactNode;
  tooltipValueFormatter?: React.ComponentProps<typeof ChartTooltipContent>["formatter"];
}

/**
 * Composant générique ChartRace (ligne animée type "race") pour Recharts.
 * Permet d'afficher plusieurs séries avec dot personnalisé (ex: image d'album).
 */
export function ChartRace({
  series,
  xAxisDataKey,
  yAxisDataKey,
  config = {},
  className = "w-full",
  yAxisDomain = [1, 5],
  yAxisReversed = true,
  xAxisTickFormatter,
  yAxisTickFormatter,
  tooltipLabelFormatter,
  tooltipValueFormatter,
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
          tickFormatter={xAxisTickFormatter}
        />
        <YAxis
          dataKey={yAxisDataKey}
          type="number"
          domain={yAxisDomain}
          tick={true}
          allowDecimals={false}
          reversed={yAxisReversed}
          padding={{ top: 32, bottom: 32 }}
          tickFormatter={yAxisTickFormatter}
        />
        <ChartTooltip
          cursor={true}
          itemSorter={(item) => Number(item.value)}
          content={<ChartTooltipContent labelFormatter={tooltipLabelFormatter} formatter={tooltipValueFormatter} />}
        />
        <Line data={chartRaceMonths} isAnimationActive={false} />
        {series.map((s) => (
          <Line
            key={s.name}
            dataKey={yAxisDataKey}
            data={s.data}
            name={s.name}
            connectNulls={false}
            dot={({ key, ...rest }) => (
							<CustomizedDot key={key} {...rest} />
						)}
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
