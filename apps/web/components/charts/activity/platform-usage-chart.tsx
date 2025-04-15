"use client";

import { ReusableAreaChart } from "@repo/ui/components/charts/area-chart";
import { ChartTooltipFormatter } from "@repo/ui/components/charts/chart-tooltip-formatter";
import { NumberFlow } from "@repo/ui/components/number";
import * as React from "react";
import { ChartCard, ChartCardContent, ChartCardHeader, ChartCardHeaderContent } from "../utils/chart-card";
import { msToHours } from "../utils/time-formatters";
import { Skeleton } from "@repo/ui/skeleton";

interface PlatformUsageChartComponentProps {
  data: Promise<{
    data: Array<{
      month: string;
      web: number;
      mobile: number;
      desktop: number;
    }>;
    mostUsedPlatform: {
      platform: string;
      value: number;
    };
  } | null>;
}

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
};

export function PlatformUsageChartComponent({
  data: promiseData,
}: PlatformUsageChartComponentProps) {
  const chartData = React.use(promiseData);
  if (!chartData) return null;

  const headerDescription = (
    <NumberFlow
      value={msToHours(chartData.mostUsedPlatform.value).toFixed(2)}
      suffix=" hours"
    />
  );

  const headerTitle = (
    <>
      Most used platform is{" "}
      <span className="font-medium">
        {chartData.mostUsedPlatform.platform.charAt(0).toUpperCase() +
          chartData.mostUsedPlatform.platform.slice(1)}
      </span>
      {" with"}
    </>
  )

  return (
    <ChartCard>
      <ChartCardHeader showSeparator title="Platform Usage Over Time" description="Showing platform usage statistics">
        <ChartCardHeaderContent title={headerTitle} description={headerDescription} />
      </ChartCardHeader>
      <ChartCardContent>
        <ReusableAreaChart
          data={chartData.data}
          xAxisDataKey="month"
          areaDataKeys={["web", "mobile", "desktop"]}
          stacked={true}
          config={chartConfig}
          tooltipValueFormatter={ChartTooltipFormatter}
          yAxisTickFormatter={(value: number) => `${msToHours(value, false)}h`}
          showLegend={true}
          className="aspect-[10/3] size-full"
        />
      </ChartCardContent>
    </ChartCard>
  );
}

export function PlatformUsageChartSkeleton() {
  return (
    <ChartCard>
      <ChartCardHeader showSeparator title="Platform Usage Over Time" description="Showing platform usage statistics">
        <ChartCardHeaderContent title={<span className="flex gap-1">Most used platform is <Skeleton className="w-11 h-4" /> with</span>} description={<Skeleton className="mt-2 w-28 h-[22px]" />} />
      </ChartCardHeader>
      <ChartCardContent>
        <Skeleton className="aspect-[10/3]" />
      </ChartCardContent>
    </ChartCard>
  );
}