import { Suspense } from "react";

import {
	DateRangeSelector,
	DateRangeSelectorSkeleton,
} from "~/components/date-range-selector/date-range-selector";
import {
	Layout,
	LayoutContent,
	LayoutHeader,
} from "~/components/layouts/layout";
import {
	PlatformUsageChart,
	PlatformUsageChartSkeleton,
} from "~/features/activity/components/platform-usage-chart";
import {
	TimeEvolutionCharts,
	TimeEvolutionChartsSkeleton,
} from "~/features/activity/components/time-evolution-charts";
import {
	TimeListenedChart,
	TimeListenedChartSkeleton,
} from "~/features/activity/components/time-listened-chart";
import { getUserInfos } from "~/lib/utils";

export default async function StatsActivityPage() {
	const { userId, isDemo } = await getUserInfos();

	return (
		<Layout>
			<LayoutHeader items={["Package", "Stats", "Activity"]}>
				<Suspense fallback={<DateRangeSelectorSkeleton />}>
					<DateRangeSelector />
				</Suspense>
			</LayoutHeader>
			<LayoutContent className="mx-auto w-full max-w-6xl">
				<Suspense fallback={<TimeListenedChartSkeleton />}>
					<TimeListenedChart userId={userId} isDemo={isDemo} />
				</Suspense>

				<Suspense fallback={<PlatformUsageChartSkeleton />}>
					<PlatformUsageChart userId={userId} isDemo={isDemo} />
				</Suspense>

				<Suspense fallback={<TimeEvolutionChartsSkeleton />}>
					<TimeEvolutionCharts userId={userId} isDemo={isDemo} />
				</Suspense>
			</LayoutContent>
		</Layout>
	);
}
