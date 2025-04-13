"use client";

import * as React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/chart";
import { NumberFlow } from "@repo/ui/components/number";
import { Skeleton } from "@repo/ui/skeleton";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartCard, ChartCardSkeleton } from "~/components/charts"; // Import the new components
import { getMsPlayedInHours } from "~/lib/utils";

import { getMonthlyPlatformData } from "./get-data";

type DataPromise = ReturnType<typeof getMonthlyPlatformData>;

type PlatformUsageChartProps = {
  data: DataPromise;
};

const chartConfig = {
  web: {
    label: "Web",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
  desktop: {
    label: "Desktop",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const msToHours = (ms: number) => ms / 1000 / 60 / 60;

export function PlatformUsageChart({
  data: dataPromise,
}: PlatformUsageChartProps) {
  const chartData = React.use(dataPromise);
  if (!chartData) return null;

  const headerContent = (
    <>
      <span className="text-xs text-muted-foreground">
        Most used platform is{" "}
        <span className="font-medium">
          {chartData.mostUsedPlatform.platform.charAt(0).toUpperCase() +
            chartData.mostUsedPlatform.platform.slice(1)}
        </span>
        {" with"}
      </span>
      <span className="text-lg font-bold leading-none sm:text-xl">
        <NumberFlow
          value={msToHours(chartData.mostUsedPlatform.value).toFixed(2)}
          suffix=" hours"
        />
      </span>
    </>
  );

  const chart = (
    <ChartContainer config={chartConfig} className="aspect-[10/3] size-full">
      <AreaChart data={chartData.data}>
        <defs>
          <linearGradient id="fillWeb" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-web)"
              stopOpacity={0.9}
            />
            <stop
              offset="95%"
              stopColor="var(--color-web)"
              stopOpacity={0.3}
            />
          </linearGradient>
          <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-mobile)"
              stopOpacity={0.9}
            />
            <stop
              offset="95%"
              stopColor="var(--color-mobile)"
              stopOpacity={0.3}
            />
          </linearGradient>
          <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-desktop)"
              stopOpacity={0.9}
            />
            <stop
              offset="95%"
              stopColor="var(--color-desktop)"
              stopOpacity={0.3}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              year: "2-digit",
            });
          }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => {
            return getMsPlayedInHours(value.toString(), false) + "h";
          }}
        />
        <ChartTooltip
          content={(props) => <CustomTooltip {...props} />}
          cursor={true}
        />
        <Area
          type="monotone"
          dataKey="web"
          stackId="1"
          stroke="var(--color-web)"
          fill="url(#fillWeb)"
        />
        <Area
          type="monotone"
          dataKey="mobile"
          stackId="1"
          stroke="var(--color-mobile)"
          fill="url(#fillMobile)"
        />
        <Area
          type="monotone"
          dataKey="desktop"
          stackId="1"
          stroke="var(--color-desktop)"
          fill="url(#fillDesktop)"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );

  return (
    <ChartCard
      title="Platform Usage Over Time"
      description="Showing platform usage statistics"
      chart={chart}
      headerContent={headerContent}
    />
  );
}

export const PlatformUsageChartSkeleton = () => {
  const headerContentSkeleton = (
    <>
      <span className="flex gap-1 text-xs text-muted-foreground">
        Most used platform is <Skeleton className="w-10 h-4" /> with
      </span>
      <span className="text-lg font-bold leading-none sm:text-xl">
        <Skeleton className="w-28 h-[30px]" />
      </span>
    </>
  );

  return (
    <ChartCardSkeleton
      title="Platform Usage Over Time"
      description="Showing platform usage statistics"
      headerContentSkeleton={headerContentSkeleton}
      chartHeightClassName="aspect-[10/3]"
    />
  );
};

type CustomTooltipProps = {
  payload?: any[];
};

const CustomTooltip = ({ payload }: CustomTooltipProps) => {
  if (!payload || payload.length === 0) return null;
  const currentData = payload[0].payload;

  return (
    <div className="text-xs flex flex-col bg-background shadow-lg rounded-md border overflow-hidden">
      <div className="border-b p-2 flex justify-between items-center gap-4">
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
              <p className="truncate text-muted-foreground">{item.name}</p>
            </div>
            <div className="font-medium">
              <NumberFlow value={getMsPlayedInHours(item.value)} suffix="h" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};