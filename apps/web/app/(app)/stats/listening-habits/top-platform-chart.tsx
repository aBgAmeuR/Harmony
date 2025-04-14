"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/chart";
import React from "react";
import { Label, Pie, PieChart } from "recharts";
import { ChartTooltipFormatter } from "~/components/charts/utils";
import { getMsPlayedInHours } from "~/lib/utils";
import { getTopPlatforms } from "./get-charts-data";

const chartConfig = {} satisfies ChartConfig;

type DataPromise = ReturnType<typeof getTopPlatforms>;

type TopPlatformChartProps = {
  data: DataPromise;
};

const colorData = (data: Awaited<DataPromise>) => {
  const colors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
  ];

  return data?.map((item, index) => ({
    ...item,
    fill: colors[index],
  }));
};

export const TopPlatformChart = ({
  data: dataPromise,
}: TopPlatformChartProps) => {
  const chartData = React.use(dataPromise);
  if (!chartData) return null;

  const totalListings = chartData.reduce(
    (total, { msPlayed }) => total + msPlayed,
    0,
  );

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square min-w-60 w-full">
      <PieChart margin={{ top: -10, left: -10, right: -10, bottom: -10 }}>
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => `${payload[0].payload.platform.charAt(0).toUpperCase()}${payload[0].payload.platform.slice(1)}`}
              formatter={ChartTooltipFormatter}
            />
          }
          cursor={false}
        />
        <Pie
          data={colorData(chartData)}
          dataKey="msPlayed"
          nameKey="platform"
          innerRadius={70}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => (
              viewBox && "cx" in viewBox && "cy" in viewBox ? (
                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                  <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                    {`${getMsPlayedInHours(totalListings, false)}h`}
                  </tspan>
                  <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                    Hours listened
                  </tspan>
                </text>
              ) : null
            )}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};
