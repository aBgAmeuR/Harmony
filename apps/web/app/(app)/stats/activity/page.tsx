import { Suspense } from "react";

import { AppHeader } from "~/components/app-header";
import { SelectMonthRange } from "~/components/select-month-range";

import {
	FirstTimeEvolutionCharts,
	FirstTimeEvolutionChartsSkeleton,
} from "~/components/charts/activity/first-time-evolution-charts";
import {
	PlatformUsageChartComponent,
	PlatformUsageChartSkeleton,
} from "~/components/charts/activity/platform-usage-chart";
import {
	TimeListenedChartComponent,
	TimeListenedChartSkeleton,
} from "~/components/charts/activity/time-listened-chart";
import { getUserInfos } from "~/lib/utils";
import {
	getFirstTimeListenedData,
	getMonthlyData,
	getMonthlyPlatformData,
} from "~/services/charts/activity";

export default async function StatsActivityPage() {
	const { userId, isDemo } = await getUserInfos();

	return (
		<>
			<AppHeader items={["Package", "Stats", "Activity"]}>
				<SelectMonthRange />
			</AppHeader>
			<div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 p-4">
				<Suspense fallback={<TimeListenedChartSkeleton />}>
					<TimeListenedChartComponent data={getMonthlyData(userId, isDemo)} />
				</Suspense>

				<Suspense fallback={<PlatformUsageChartSkeleton />}>
					<PlatformUsageChartComponent
						data={getMonthlyPlatformData(userId, isDemo)}
					/>
				</Suspense>

				<Suspense fallback={<FirstTimeEvolutionChartsSkeleton />}>
					<FirstTimeEvolutionCharts
						data={getFirstTimeListenedData(userId, isDemo)}
					/>
				</Suspense>
			</div>
		</>
	);
}
