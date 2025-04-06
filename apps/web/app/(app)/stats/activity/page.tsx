import React, { Suspense } from "react";
import { auth } from "@repo/auth";

import { AppHeader } from "~/components/app-header";
import { SelectMonthRange } from "~/components/select-month-range";

import {
  FirstTimeEvolutionCharts,
  FirstTimeEvolutionChartsSkeleton,
} from "./first-time-evolution-charts";
import {
  getFirstTimeListenedData,
  getMonthlyData,
  getMonthlyPlatformData,
} from "./get-data";
import {
  PlatformUsageChart,
  PlatformUsageChartSkeleton,
} from "./platform-usage-chart";
import {
  TimeListenedChart,
  TimeListenedChartSkeleton,
} from "./time-listened-chart";

export default async function StatsActivityPage() {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <>
      <AppHeader items={["Package", "Stats", "Activity"]}>
        <SelectMonthRange />
      </AppHeader>
      <div className="flex flex-1 flex-col gap-4 p-4 max-w-6xl w-full mx-auto">
        <Suspense fallback={<TimeListenedChartSkeleton />}>
          <TimeListenedChart data={getMonthlyData(userId)} />
        </Suspense>
        <Suspense fallback={<PlatformUsageChartSkeleton />}>
          <PlatformUsageChart data={getMonthlyPlatformData(userId)} />
        </Suspense>
        <Suspense fallback={<FirstTimeEvolutionChartsSkeleton />}>
          <FirstTimeEvolutionCharts data={getFirstTimeListenedData(userId)} />
        </Suspense>
      </div>
    </>
  );
}
