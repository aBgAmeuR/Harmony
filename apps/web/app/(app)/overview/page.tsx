import { Suspense } from "react";

import { AppHeader } from "~/components/app-header";
import { SelectMonthRange } from "~/components/select-month-range";

import { getMonthlyData } from "../../../services/charts/activity";

import {
	TimeListenedChartComponent,
	TimeListenedChartSkeleton,
} from "~/components/charts/activity/time-listened-chart";
import { getUserInfos } from "~/lib/utils";
import { getListeningPatternData } from "./get-listening-pattern-data";
import {
	ListeningPatternChart,
	ListeningPatternChartSkeleton,
} from "./listening-pattern-chart";
import { RankingList } from "./ranking-list";
import { TopStatsCards, TopStatsCardsSkeleton } from "./top-stats-cards";

export default async function OverviewPage() {
	const { userId, isDemo } = await getUserInfos();

	return (
		<>
			<AppHeader items={["Package", "Overview"]}>
				<SelectMonthRange />
			</AppHeader>
			<div className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col gap-4 p-4 pt-2">
				<Suspense fallback={<TopStatsCardsSkeleton />}>
					<TopStatsCards />
				</Suspense>
				<div className="flex flex-col gap-4 md:flex-row">
					<Suspense fallback={<TimeListenedChartSkeleton className="flex-1" />}>
						<TimeListenedChartComponent
							data={getMonthlyData(userId, isDemo)}
							className="flex-1"
						/>
					</Suspense>
					<Suspense fallback={<ListeningPatternChartSkeleton />}>
						<ListeningPatternChart data={getListeningPatternData(userId)} />
					</Suspense>
				</div>
				<div className="grid gap-4 lg:grid-cols-2">
					<RankingList type="dashboardArtists" className="col-span-1" />
					<RankingList type="dashboardTracks" className="col-span-1" />
				</div>
			</div>
		</>
	);
}
