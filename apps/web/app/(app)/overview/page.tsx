
import { Suspense } from "react";

import { getUser } from "@repo/auth";

import { DateRangeSelector, DateRangeSelectorSkeleton } from "~/components/date-range-selector/date-range-selector";
import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { UserHasNotPackage } from "~/components/user-has-not-package";
import { TimeListenedChart, TimeListenedChartSkeleton } from "~/features/activity/components/time-listened-chart";
import { ListeningPatternChart, ListeningPatternChartSkeleton } from "~/features/overview/components/listening-pattern-chart";
import { StatsCards, StatsCardsSkeleton } from "~/features/overview/components/stats-cards";
import { TopArtistsCard } from "~/features/overview/components/top-artists-card";
import { TopTracksCard } from "~/features/overview/components/top-tracks-card";

export default async function OverviewPage() {
	const { hasPackage } = await getUser();

	if (!hasPackage)
		return (
			<Layout>
				<LayoutHeader items={["Package", "Overview"]} />
				<LayoutContent className="mx-auto w-full max-w-screen-2xl pt-2">
					<UserHasNotPackage />
				</LayoutContent>
			</Layout>
		);

	return (
		<Layout>
			<LayoutHeader items={["Package", "Overview"]}>
				<Suspense fallback={<DateRangeSelectorSkeleton />}>
					<DateRangeSelector />
				</Suspense>
			</LayoutHeader>
			<LayoutContent className="mx-auto w-full max-w-screen-2xl pt-2">
				<Suspense fallback={<StatsCardsSkeleton />}>
					<StatsCards />
				</Suspense>
				<div className="flex flex-col gap-4 md:flex-row">
					<Suspense fallback={<TimeListenedChartSkeleton className="flex-1" />}>
						<TimeListenedChart className="flex-1"/>
					</Suspense>
					<Suspense fallback={<ListeningPatternChartSkeleton />}>
						<ListeningPatternChart />
					</Suspense>
				</div>
				<div className="grid gap-4 lg:grid-cols-2">
					<TopArtistsCard />
					<TopTracksCard />
				</div>
			</LayoutContent>
		</Layout>
	);
}
