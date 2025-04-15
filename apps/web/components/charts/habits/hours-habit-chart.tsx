"use client";

import * as React from "react";
import { ReusableAreaChart } from "@repo/ui/components/charts/area-chart";
import { ChartCard, ChartCardContent, ChartCardHeader } from "../utils/chart-card";
import { Skeleton } from "@repo/ui/skeleton";

interface HoursHabitChartComponentProps {
  data: Promise<{
    hour: string;
    msPlayed: number;
  }[] | null>;
}

export function HoursHabitChartComponent({
  data: dataPromise,
}: HoursHabitChartComponentProps) {
  const chartData = React.use(dataPromise);
  if (!chartData) return null;

  return (
    <ChartCard>
      <ChartCardHeader title="Listening Hours" description="When you listen most during the day" />
      <ChartCardContent>
        <ReusableAreaChart
          data={chartData}
          className="aspect-video"
          areaDataKeys={["msPlayed"]}
          xAxisDataKey="hour"
          showYAxis={false}
          config={{
            msPlayed: {
              label: "Time Played",
              color: "var(--chart-2)",
            }
          }}
          tooltipLabelFormatter={(value) => `${value}h`}
          xAxisTickFormatter={(hour: string) => `${hour}h`}
        />
      </ChartCardContent>
    </ChartCard>
  );
}

export function HoursHabitChartSkeleton() {
  return (
    <ChartCard>
      <ChartCardHeader title="Listening Hours" description="When you listen most during the day" />
      <ChartCardContent>
        <Skeleton className="aspect-video" />
      </ChartCardContent>
    </ChartCard>
  );
}