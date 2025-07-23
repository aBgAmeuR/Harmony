import { Suspense } from "react";

import { DateRangeSelector, DateRangeSelectorSkeleton } from "~/components/date-range-selector/date-range-selector";
import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { DaysHabitsChart, DaysHabitsChartSkeleton } from "~/features/listening-habits/components/days-habits-chart";
import { HoursHabitsChart, HoursHabitsChartSkeleton } from "~/features/listening-habits/components/hours-habits-chart";
import { ShuffleHabitsChart, ShuffleHabitsChartSkeleton } from "~/features/listening-habits/components/shuffle-habits-chart";
import { SkippedHabitsChart, SkippedHabitsChartSkeleton } from "~/features/listening-habits/components/skipped-habits-chart";
import { TopPlatformsChart, TopPlatformsChartSkeleton } from "~/features/listening-habits/components/top-platforms-chart";

export default async function StatsListeningHabitsPage() {
	return (
		<Layout>
			<LayoutHeader items={["Package", "Stats", "Listening Habits"]}>
				<Suspense fallback={<DateRangeSelectorSkeleton />}>
					<DateRangeSelector />
				</Suspense>
			</LayoutHeader>
			<LayoutContent className="mx-auto w-full max-w-6xl lg:flex-row">
				<div className="flex flex-1 flex-col gap-4">
					<Suspense fallback={<HoursHabitsChartSkeleton />}>
						<HoursHabitsChart />
					</Suspense>

					<Suspense fallback={<DaysHabitsChartSkeleton />}>
						<DaysHabitsChart />
					</Suspense>
				</div>
				<div className="flex flex-wrap justify-center gap-4 md:justify-start lg:flex-col lg:flex-nowrap">
					<Suspense fallback={<TopPlatformsChartSkeleton />}>
						<TopPlatformsChart />
					</Suspense>

					<Suspense fallback={<ShuffleHabitsChartSkeleton />}>
						<ShuffleHabitsChart />
					</Suspense>

					<Suspense fallback={<SkippedHabitsChartSkeleton />}>
						<SkippedHabitsChart />
					</Suspense>
				</div>
			</LayoutContent>
		</Layout>
	);
}
