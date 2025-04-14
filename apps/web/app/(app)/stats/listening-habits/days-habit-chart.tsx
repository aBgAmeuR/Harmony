"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/chart";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import { getMsPlayedInHours } from "~/lib/utils";

import { ChartTooltipFormatter } from "~/components/charts/utils";
import { getDaysHabit } from "./get-charts-data";
import React from "react";

const chartConfig = {
  msPlayed: {
    label: "Listening Time",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type DataPromise = ReturnType<typeof getDaysHabit>;

type DaysHabitChartProps = {
  data: DataPromise;
};

export const DaysHabitChart = ({ data: dataPromise }: DaysHabitChartProps) => {
  const chartData = React.use(dataPromise);
  if (!chartData) return null;

  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 24 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip
          content={<ChartTooltipContent formatter={ChartTooltipFormatter} />}
          cursor={false}
        />
        <Bar dataKey="msPlayed" fill="var(--color-msPlayed)" radius={8}>
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
            formatter={(value: number) => `${getMsPlayedInHours(value)}h`}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}