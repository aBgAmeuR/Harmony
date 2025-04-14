"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { ChartTooltipFormatter, createGradientDefs } from "~/components/charts/utils";
import { getHoursHabit } from "./get-charts-data";
import React from "react";

const chartConfig = {
  msPlayed: {
    label: "Listening Time",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type DataPromise = ReturnType<typeof getHoursHabit>;

type HoursHabitChartProps = {
  data: DataPromise;
};

export const HoursHabitChart = ({ data: dataPromise }: HoursHabitChartProps) => {
  const chartData = React.use(dataPromise);
  if (!chartData) return null;

  return (
    <ChartContainer config={chartConfig}>
      <AreaChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        {createGradientDefs([{ label: "msPlayed", color: "var(--color-msPlayed)" }])}
        <XAxis
          dataKey="hour"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `${value}h`}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) => `${value}h`}
              formatter={ChartTooltipFormatter}
            />
          }
          cursor={false}
        />
        <Area
          dataKey="msPlayed"
          type="monotone"
          fill="url(#fillmsPlayed)"
          fillOpacity={0.4}
          stroke="var(--color-msPlayed)"
        />
      </AreaChart>
    </ChartContainer>
  );
};
