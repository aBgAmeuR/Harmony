"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@repo/ui/chart";
import { NumberFlow } from "@repo/ui/components/number";
import { Skeleton } from "@repo/ui/skeleton";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartCard, ChartCardSkeleton } from "~/components/charts"; // Import the new components
import { getMsPlayedInHours } from "~/lib/utils";

import { ChartTooltipFormatter, createGradientDefs, msToHours } from "~/components/charts/utils";
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
        {createGradientDefs(Object.values(chartConfig))}
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => getMsPlayedInHours(value.toString(), false) + "h"}
        />
        <ChartTooltip
          content={<ChartTooltipContent formatter={ChartTooltipFormatter} />}
          cursor={false}
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
