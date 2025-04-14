"use client";

import * as React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/chart";
import { NumberFlow } from "@repo/ui/components/number";
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
    config={{ value: { label: "value", color } }}
    className="aspect-video size-full"
  >
    <LineChart accessibilityLayer data={data} syncId={syncId}>
      <CartesianGrid vertical={false} strokeDasharray="3 3" />
      <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
      <ChartTooltip content={(props) => <CustomTooltip {...props} label={tooltipLabel} />} cursor={true} />
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
        className="justify-between"
        showSeparator={false}
        paddingHeaderContent={true}
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
        className="justify-between"
        showSeparator={false}
        paddingHeaderContent={true}
      />
      <ChartCard
        title="Artists Evolution"
        description="Evolution of artists listened to for the first time."
        chart={renderLineChart(
          chartData.artists.data,
          "var(--chart-3)",
          "first-time-evolution",
          "Artists",
        )}
        cardContentClassName="p-0"
        className="justify-between"
        showSeparator={false}
        paddingHeaderContent={true}
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
        className="justify-between"
        paddingHeaderContent={true}
      />
      <ChartCardSkeleton
        title="Albums Evolution"
        description="Evolution of albums listened to for the first time."
        chartHeightClassName="aspect-video"
        showSeparator={false}
        className="justify-between"
        paddingHeaderContent={true}
      />
      <ChartCardSkeleton
        title="Artists Evolution"
        description="Evolution of artists listened to for the first time"
        chartHeightClassName="aspect-video"
        showSeparator={false}
        className="justify-between"
        paddingHeaderContent={true}
      />
    </div>
  );
};

const CustomTooltip = ({ payload, label }: { payload?: any[]; label: string }) => {
  if (!payload || payload.length === 0) return null;
  const currentData = payload[0].payload;

  return (
    <div className="text-xs flex flex-col bg-background shadow-lg rounded-md border overflow-hidden">
      <div className="p-2 pb-0 flex justify-between items-center">
        <p>{currentData.month}</p>
      </div>
      <div className="flex flex-col gap-1.5 px-3 py-2">
        {payload.map((item, index) => (
          <div key={index} className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-1 truncate">
              <span
                className="size-2.5 shrink-0 rounded-xs"
                style={{ "backgroundColor": item.color } as React.CSSProperties}
                aria-hidden="true"
              />
              <p className="truncate text-muted-foreground">{label}</p>
            </div>
            <div className="font-medium">
              <NumberFlow value={item.value} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};