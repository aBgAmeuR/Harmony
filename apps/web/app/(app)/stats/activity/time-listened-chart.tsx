"use client";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@repo/ui/chart";
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

import { ChartTooltipFormatter, msToHours } from "~/components/charts/utils";
import { getMonthlyData } from "./get-data";

type DataPromise = ReturnType<typeof getMonthlyData>;

type TimeListenedChartProps = {
  data: DataPromise;
  className?: string;
};

const chartConfig = {
  value: {
    label: "Listening Time",
    color: "var(--chart-1) ",
  },
} satisfies ChartConfig;

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
          content={<ChartTooltipContent labelFormatter={(value, payload) => labelFormatter(value, payload, chartData.average)} formatter={ChartTooltipFormatter} />}
          cursor={false}
        />
        <Bar dataKey="value" fill="var(--color-value)" radius={4} />
        <ReferenceLine y={chartData.average} stroke="red" strokeDasharray="3 3">
          <Label value="Average" position="insideBottomLeft" fill="red" />
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

const labelFormatter = (value: string, payload: any, average: number) => {
  const percentage = ((payload[0].value - average) / average) * 100;

  return (
    <div className="w-full flex justify-between items-center gap-2">
      <p>{value}</p>
      {percentage >= 0 ? (
        <NumberFlow
          value={Math.abs(percentage).toFixed(2)}
          prefix={percentage > 0 ? "+" : "-"}
          suffix="%"
          className="font-medium text-emerald-700 dark:text-emerald-500"
        />
      ) : (
        <NumberFlow
          value={Math.abs(percentage).toFixed(2)}
          prefix={percentage > 0 ? "+" : "-"}
          suffix="%"
          className="font-medium text-red-700 dark:text-red-500"
        />
      )}
    </div>
  );
};
