import { Suspense } from "react";
import { AppHeader } from "~/components/app-header";
import { SelectMonthRange } from "~/components/select-month-range";
import { getUserInfos } from "~/lib/utils";

import {
	DaysHabitChartComponent,
	DaysHabitChartSkeleton,
} from "~/components/charts/habits/days-habit-chart";
import {
	HoursHabitChartComponent,
	HoursHabitChartSkeleton,
} from "~/components/charts/habits/hours-habit-chart";
import {
	ShuffleHabitChartComponent,
	ShuffleHabitChartSkeleton,
} from "~/components/charts/habits/shuffle-habit-chart";
import {
	SkippedHabitChartComponent,
	SkippedHabitChartSkeleton,
} from "~/components/charts/habits/skipped-habit-chart";
import {
	TopPlatformChartComponent,
	TopPlatformChartSkeleton,
} from "~/components/charts/habits/top-platform-chart";
import {
	getDaysHabit,
	getHoursHabit,
	getShuffleHabit,
	getSkippedHabit,
	getTopPlatforms,
} from "~/services/charts/listening-habits";

export default async function StatsListeningHabitsPage() {
	const { userId, isDemo } = await getUserInfos();

	return (
		<>
			<AppHeader items={["Package", "Stats", "Listening Habits"]}>
				<SelectMonthRange />
			</AppHeader>
			<main className="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4 lg:flex-row">
				<div className="flex flex-1 flex-col gap-4">
					<Suspense fallback={<HoursHabitChartSkeleton />}>
						<HoursHabitChartComponent data={getHoursHabit(userId, isDemo)} />
					</Suspense>

					<Suspense fallback={<DaysHabitChartSkeleton />}>
						<DaysHabitChartComponent data={getDaysHabit(userId, isDemo)} />
					</Suspense>
				</div>
				<div className="flex flex-wrap justify-center gap-4 md:justify-start lg:flex-col lg:flex-nowrap">
					<Suspense fallback={<TopPlatformChartSkeleton />}>
						<TopPlatformChartComponent data={getTopPlatforms(userId, isDemo)} />
					</Suspense>

					<Suspense fallback={<ShuffleHabitChartSkeleton />}>
						<ShuffleHabitChartComponent
							data={getShuffleHabit(userId, isDemo)}
						/>
					</Suspense>

					<Suspense fallback={<SkippedHabitChartSkeleton />}>
						<SkippedHabitChartComponent
							data={getSkippedHabit(userId, isDemo)}
						/>
					</Suspense>
				</div>
			</main>
		</>
	);
}
