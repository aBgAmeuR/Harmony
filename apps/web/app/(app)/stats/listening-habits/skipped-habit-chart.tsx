"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/chart";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import { getSkippedHabit } from "./get-charts-data";
import React from "react";

const chartConfig = {
  skipped: {
    label: "Skipped",
    color: "var(--chart-1)",
  },
  notSkipped: {
    label: "Not Skipped",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

type DataPromise = ReturnType<typeof getSkippedHabit>;

type SkippedHabitChartProps = {
  data: DataPromise;
};

export const SkippedHabitChart = ({
  data: dataPromise,
}: SkippedHabitChartProps) => {
  const chartData = React.use(dataPromise);
  if (!chartData) return null;

  const skippedPercentage = Math.round(
    (chartData[0].skipped / (chartData[0].skipped + chartData[0].notSkipped)) *
      100,
  );

  return (
    <div className="flex overflow-hidden w-full min-w-60 h-40 justify-center items-start">
      <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full">
        <RadialBarChart
          data={chartData}
          endAngle={180}
          innerRadius={80}
          outerRadius={130}
        >
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => (
                viewBox && "cx" in viewBox && "cy" in viewBox ? (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 16} className="fill-foreground text-2xl font-bold">
                      {`${skippedPercentage}%`}
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 4} className="fill-muted-foreground">
                      Tracks Skipped
                    </tspan>
                  </text>
                ) : null
              )}
            />
          </PolarRadiusAxis>
          <RadialBar
            dataKey="skipped"
            stackId="a"
            cornerRadius={5}
            fill="var(--color-skipped)"
            className="stroke-transparent stroke-2"
          />
          <RadialBar
            dataKey="notSkipped"
            stackId="a"
            cornerRadius={5}
            fill="var(--color-notSkipped)"
            className="stroke-transparent stroke-2"
          />
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
};
