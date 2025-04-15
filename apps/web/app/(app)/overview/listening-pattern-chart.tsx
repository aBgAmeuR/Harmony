"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/chart";
import { ChartTooltipFormatter } from "@repo/ui/components/charts/chart-tooltip-formatter";
import { cn } from "@repo/ui/lib/utils";
import { Skeleton } from "@repo/ui/skeleton";
import { Brain } from "lucide-react";
import React from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

const chartConfig = {
  time: {
    label: "Time",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type ListeningPatternChartProps = {
  data: Promise<{
    subject: any;
    time: number;
  }[] | null>;
  className?: string;
};

export function ListeningPatternChart({
  data: dataPromise,
  className,
}: ListeningPatternChartProps) {
  const chartData = React.use(dataPromise);
  if (!chartData) return null;

  return (
    <Card className={cn("pb-0", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          Listening Patterns
        </CardTitle>
        <Brain className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pb-0 max-h-56 md:max-h-52 lg:max-h-64 xl:max-h-80 2xl:max-h-[350px] size-full">
        <ChartContainer
          config={chartConfig}
          className="mx-auto size-full aspect-square w-56 md:w-52 lg:w-64 xl:w-80 2xl:w-[350px]"
        >
          <RadarChart
            data={chartData}
            margin={{ top: 18, right: 18, bottom: 18, left: 18 }}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent formatter={ChartTooltipFormatter} />}
            />
            <PolarAngleAxis dataKey="subject" width={50} />
            <PolarGrid />
            <Radar
              dataKey="time"
              fill="var(--color-time)"
              fillOpacity={0.6}
              dot={{ r: 4, fillOpacity: 1 }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export const ListeningPatternChartSkeleton = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          Listening Patterns
        </CardTitle>
        <Brain className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="max-h-56 md:max-h-52 lg:max-h-64 xl:max-h-80 2xl:max-h-[350px] size-full ">
        <div className="mx-auto w-56 md:w-52 lg:w-64 xl:w-80 2xl:w-[350px] aspect-square ">
          <div className="size-full pb-6">
            <Skeleton className="size-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
