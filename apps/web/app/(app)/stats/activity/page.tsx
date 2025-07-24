import { Suspense } from "react";

import { DateRangeSelector, DateRangeSelectorSkeleton } from "~/components/date-range-selector/date-range-selector";
import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { PlatformUsageChart, PlatformUsageChartSkeleton } from "~/features/activity/components/platform-usage-chart";
import { TimeEvolutionCharts, TimeEvolutionChartsSkeleton } from "~/features/activity/components/time-evolution-charts";
import { TimeListenedChart, TimeListenedChartSkeleton } from "~/features/activity/components/time-listened-chart";

export default async function StatsActivityPage() {
	return (
		<Layout>
			<LayoutHeader items={["Package", "Stats", "Activity"]}>
				<Suspense fallback={<DateRangeSelectorSkeleton />}>
					<DateRangeSelector />
				</Suspense>
			</LayoutHeader>
			<LayoutContent className="mx-auto w-full max-w-6xl">
				<Suspense fallback={<TimeListenedChartSkeleton />}>
					<TimeListenedChart />
				</Suspense>

				<Suspense fallback={<PlatformUsageChartSkeleton />}>
					<PlatformUsageChart />
				</Suspense>

				<Suspense fallback={<TimeEvolutionChartsSkeleton />}>
					<TimeEvolutionCharts />
				</Suspense>
			</LayoutContent>
		</Layout>
	);
}
