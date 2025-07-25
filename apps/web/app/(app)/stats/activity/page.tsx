import { Suspense } from "react";
import type { Metadata } from "next";

import { DateRangeSelector, DateRangeSelectorSkeleton } from "~/components/date-range-selector/date-range-selector";
import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { PlatformUsageChart, PlatformUsageChartSkeleton } from "~/features/activity/components/platform-usage-chart";
import { TimeEvolutionCharts, TimeEvolutionChartsSkeleton } from "~/features/activity/components/time-evolution-charts";
import { TimeListenedChart, TimeListenedChartSkeleton } from "~/features/activity/components/time-listened-chart";

export const metadata: Metadata = {
	title: "Stats Activity",
	description: "Track your listening time, platform usage and discover listening trends",
};

export default async function StatsActivityPage() {
	return (
		<Layout>
			<LayoutHeader items={["Package", "Stats", "Activity"]} metadata={metadata}>
				<Suspense fallback={<DateRangeSelectorSkeleton />}>
					<DateRangeSelector />
				</Suspense>
			</LayoutHeader>
			<LayoutContent>
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
