import { Suspense } from "react";

import { AppHeader } from "~/components/app-header";
import { SelectMonthRange } from "~/components/select-month-range";

import { getUserInfos } from "~/lib/utils";
import { PlatformUsageChartComponent, PlatformUsageChartSkeleton } from "~/components/charts/activity/platform-usage-chart";
import { TimeListenedChartComponent, TimeListenedChartSkeleton } from "~/components/charts/activity/time-listened-chart";
import { getFirstTimeListenedData, getMonthlyData, getMonthlyPlatformData } from "~/services/charts/activity";
import { FirstTimeEvolutionCharts, FirstTimeEvolutionChartsSkeleton } from "~/components/charts/activity/first-time-evolution-charts";

export default async function StatsActivityPage() {
  const { userId, isDemo } = await getUserInfos();

  return (
    <>
      <AppHeader items={["Package", "Stats", "Activity"]}>
        <SelectMonthRange />
      </AppHeader>
      <div className="flex flex-1 flex-col gap-4 p-4 max-w-6xl w-full mx-auto">
        <Suspense fallback={<TimeListenedChartSkeleton />}>
          <TimeListenedChartComponent data={getMonthlyData(userId, isDemo)} />
        </Suspense>

        <Suspense fallback={<PlatformUsageChartSkeleton />}>
          <PlatformUsageChartComponent data={getMonthlyPlatformData(userId, isDemo)} />
        </Suspense>
        
        <Suspense fallback={<FirstTimeEvolutionChartsSkeleton />}>
          <FirstTimeEvolutionCharts data={getFirstTimeListenedData(userId, isDemo)} />
        </Suspense>
      </div>
    </>
  );
}
