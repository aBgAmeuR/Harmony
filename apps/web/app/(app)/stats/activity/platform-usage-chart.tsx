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
import { NumberFlow } from "@repo/ui/number";
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
        {/* ... defs and other chart elements ... */}
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
        <CartesianGrid vertical={false} />
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
          cursor={false}
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
                    <div className="font-normal">{name}</div>
                    <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                      <NumberFlow
                        value={getMsPlayedInHours(value.toString())}
                      />
                      <span className="font-normal text-muted-foreground">
                        hours
                      </span>
                    </div>
                  </div>
                </div>
              )}
              indicator="dot"
            />
          }
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
