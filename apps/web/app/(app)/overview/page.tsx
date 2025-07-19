
import { Suspense } from "react";

import { DateRangeSelector, DateRangeSelectorSkeleton } from "~/components/date-range-selector/date-range-selector";
import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { UserHasNotPackage } from "~/components/user-has-not-package";
import { TimeListenedChart, TimeListenedChartSkeleton } from "~/features/activity/components/time-listened-chart";
import { ListeningPatternChart, ListeningPatternChartSkeleton } from "~/features/overview/components/listening-pattern-chart";
import { StatsCards, StatsCardsSkeleton } from "~/features/overview/components/stats-cards";
import { TopArtistsCard } from "~/features/overview/components/top-artists-card";
import { TopTracksCard } from "~/features/overview/components/top-tracks-card";
import { getUserInfos } from "~/lib/utils-server";

export default async function OverviewPage() {
	const { userId, isDemo, hasPackage } = await getUserInfos();

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
					<StatsCards userId={userId} isDemo={isDemo} />
				</Suspense>
				<div className="flex flex-col gap-4 md:flex-row">
					<Suspense fallback={<TimeListenedChartSkeleton className="flex-1" />}>
						<TimeListenedChart
							userId={userId}
							isDemo={isDemo}
							className="flex-1"
						/>
					</Suspense>
					<Suspense fallback={<ListeningPatternChartSkeleton />}>
						<ListeningPatternChart userId={userId} isDemo={isDemo} />
					</Suspense>
				</div>
				<div className="grid gap-4 lg:grid-cols-2">
					<TopArtistsCard userId={userId} isDemo={isDemo} />
					<TopTracksCard userId={userId} isDemo={isDemo} />
				</div>
			</LayoutContent>
		</Layout>
	);
}
