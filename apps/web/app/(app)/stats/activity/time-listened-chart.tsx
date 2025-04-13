"use client";

import { ChartConfig, ChartContainer, ChartTooltip } from "@repo/ui/chart";
import { NumberFlow } from "@repo/ui/components/number";
import { Skeleton } from "@repo/ui/skeleton";
import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  ReferenceLine,
  XAxis
} from "recharts";

import { ChartCard, ChartCardSkeleton } from "~/components/charts";
import { getMsPlayedInHours } from "~/lib/utils";

import { getMonthlyData } from "./get-data";

type DataPromise = ReturnType<typeof getMonthlyData>;
type Data = NonNullable<Awaited<DataPromise>>;

type TimeListenedChartProps = {
  data: DataPromise;
  className?: string;
};

const chartConfig = {
  month: {
    label: "month",
    color: "var(--chart-1) ",
  },
} satisfies ChartConfig;

const msToHours = (ms: number) => ms / 1000 / 60 / 60;

const calculatePercentageChange = (current: number, previous: number) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export function TimeListenedChart({
  data: dataPromise,
  className,
}: TimeListenedChartProps) {
  const chartData = React.use(dataPromise);
  if (!chartData) return null;

  const headerContent = (
    <>
      <span className="text-xs text-muted-foreground">
        Average time listened
      </span>
      <span className="text-lg font-bold leading-none sm:text-xl">
        <NumberFlow
          value={msToHours(chartData.average).toFixed(2)}
          suffix=" hours"
        />
      </span>
    </>
  );

  const chart = (
    <ChartContainer config={chartConfig} className="aspect-[10/3] w-full">
      <BarChart accessibilityLayer data={chartData.data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          content={(props) => <CustomTooltip {...props} chartData={chartData} />}
          cursor={true}
        />
        <Bar dataKey="value" fill="var(--color-month)" radius={4} />
        <ReferenceLine
          y={chartData.average}
          stroke="red"
          strokeDasharray="3 3"
        >
          <Label value="Average" position="insideTopLeft" fill="red" />
        </ReferenceLine>
      </BarChart>
    </ChartContainer>
  );

  return (
    <ChartCard
      title="Time Listened Over Months"
      description="Showing total time listened in hours over the months"
      chart={chart}
      headerContent={headerContent}
      className={className}
      cardContentClassName="pt-6"
    />
  );
}

export const TimeListenedChartSkeleton = ({
  className,
}: {
  className?: string;
}) => {
  const headerContentSkeleton = (
    <>
      <span className="text-xs text-muted-foreground">
        Average time listened
      </span>
      <span className="text-lg font-bold leading-none sm:text-xl">
        <Skeleton className="py-px">101,46 hours</Skeleton>
      </span>
    </>
  );

  return (
    <ChartCardSkeleton
      title="Time Listened Over Months"
      description="Showing total time listened in hours over the months"
      headerContentSkeleton={headerContentSkeleton}
      chartHeightClassName="aspect-[10/3]"
      className={className}
    />
  );
};

type CustomTooltipProps = {
  payload?: any[];
  chartData: Data;
};

const CustomTooltip = ({ payload, chartData }: CustomTooltipProps) => {
  if (!payload || payload.length === 0) return null;
  const currentData = payload[0].payload;
  const currentIndex = chartData.data.findIndex(
    (item) => item.month === currentData.month,
  );
  const previousData =
    currentIndex > 0 ? chartData.data[currentIndex - 1] : null;
  const percentageChange = previousData
    ? calculatePercentageChange(currentData.value, previousData.value)
    : 0;

  return (
    <div className="text-xs flex flex-col bg-background shadow-lg rounded-md border overflow-hidden">
      <div className="border-b p-2 flex justify-between items-center gap-4">
        <p>{currentData.month}</p>
        {previousData && (
          <div className="flex items-center h-4">
            {percentageChange >= 0 ? (
              <NumberFlow
                value={Math.abs(percentageChange).toFixed(2)}
                prefix={percentageChange > 0 ? "+" : "-"}
                suffix="%"
                className="font-medium text-emerald-700 dark:text-emerald-500"
              />
            ) : (
              <NumberFlow
                value={Math.abs(percentageChange).toFixed(2)}
                prefix={percentageChange > 0 ? "+" : "-"}
                suffix="%"
                className="font-medium text-red-700 dark:text-red-500"
              />
            )}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between space-x-4 px-3 py-2">
        <div className="flex items-center space-x-1 truncate">
          <span
            className="size-2.5 shrink-0 rounded-xs"
            style={{ "backgroundColor": "var(--color-month)" } as React.CSSProperties}
            aria-hidden="true"
          />
          <p className="truncate text-muted-foreground">Time listened</p>
        </div>
        <div className="font-medium">
          <NumberFlow value={getMsPlayedInHours(currentData.value)} suffix="h" />
        </div>
      </div>
    </div>
  );
};