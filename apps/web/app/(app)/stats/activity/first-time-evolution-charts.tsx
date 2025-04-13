"use client";

import * as React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/chart";
import { NumberFlow } from "@repo/ui/number";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { ChartCard, ChartCardSkeleton } from "~/components/charts"; // Import the new components

import { getFirstTimeListenedData } from "./get-data";

type DataPromise = ReturnType<typeof getFirstTimeListenedData>;

type FirstTimeEvolutionChartsProps = {
  data: DataPromise;
};

const renderLineChart = (
  data: any,
  color: string,
  syncId: string,
  tooltipLabel: string,
) => (
  <ChartContainer
    config={{
      value: {
        label: "value",
        color,
      },
    }}
    className="aspect-video size-full"
  >
    <LineChart accessibilityLayer data={data} syncId={syncId}>
      <CartesianGrid vertical={false} />
      <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
      <ChartTooltip
        content={
          <ChartTooltipContent
            labelFormatter={(value) => {
              return new Date(value).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              });
            }}
            formatter={(value, name, item) => (
              <div>
                <div className="flex items-center gap-1">
                  <div
                    className="size-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                    style={
                      {
                        "--color-bg": `var(--color-${item.dataKey})`,
                      } as React.CSSProperties
                    }
                  />
                  <div className="font-normal">{tooltipLabel}</div>
                  <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                    <NumberFlow value={value.toString()} />
                  </div>
                </div>
              </div>
            )}
          />
        }
        cursor={false}
      />
      <Line
        dataKey="value"
        type="linear"
        stroke="var(--color-value)"
        strokeWidth={2}
        dot={false}
      />
    </LineChart>
  </ChartContainer>
);

export function FirstTimeEvolutionCharts({
  data: dataPromise,
}: FirstTimeEvolutionChartsProps) {
  const chartData = React.use(dataPromise);
  if (!chartData) return null;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <ChartCard
        title="Tracks Evolution"
        description="Evolution of tracks listened to for the first time."
        chart={renderLineChart(
          chartData.tracks.data,
          "var(--chart-1)",
          "first-time-evolution",
          "Tracks",
        )}
        cardContentClassName="p-0"
        showSeparator={false}
      />
      <ChartCard
        title="Albums Evolution"
        description="Evolution of albums listened to for the first time."
        chart={renderLineChart(
          chartData.albums.data,
          "var(--chart-2)",
          "first-time-evolution",
          "Albums",
        )}
        cardContentClassName="p-0"
        showSeparator={false}
      />
      <ChartCard
        title="Artists Evolution"
        description="Evolution of artists listened to for the first time."
        chart={renderLineChart(
          chartData.artists.data,
          "hsl(var(--chart-3))",
          "first-time-evolution",
          "Artists",
        )}
        cardContentClassName="p-0"
        showSeparator={false}
      />
    </div>
  );
}

export const FirstTimeEvolutionChartsSkeleton = () => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <ChartCardSkeleton
        title="Tracks Evolution"
        description="Evolution of tracks listened to for the first time."
        chartHeightClassName="aspect-video"
        showSeparator={false}
      />
      <ChartCardSkeleton
        title="Albums Evolution"
        description="Evolution of albums listened to for the first time."
        chartHeightClassName="aspect-video"
        showSeparator={false}
      />
      <ChartCardSkeleton
        title="Artists Evolution"
        description="Evolution of artists listened to for the first time"
        chartHeightClassName="aspect-video"
        showSeparator={false}
      />
    </div>
  );
};
