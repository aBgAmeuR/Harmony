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
	ListeningSessionCard,
	ListeningSessionCardSkeleton,
} from "~/features/numbers/components/listening-session-card";
import {
	NumbersStatsCards,
	NumbersStatsCardsSkeleton,
} from "~/features/numbers/components/numbers-stats-cards";
import { getUserInfos } from "~/lib/utils";

export default async function StatsNumbersPage() {
	const { userId, isDemo } = await getUserInfos();

	return (
		<Layout>
			<LayoutHeader items={["Package", "Stats", "Numbers"]}>
				<Suspense fallback={<DateRangeSelectorSkeleton />}>
					<DateRangeSelector />
				</Suspense>
			</LayoutHeader>
			<LayoutContent className="mx-auto w-full max-w-7xl">
				<Suspense fallback={<ListeningSessionCardSkeleton />}>
					<ListeningSessionCard userId={userId} isDemo={isDemo} />
				</Suspense>
				<Suspense fallback={<NumbersStatsCardsSkeleton />}>
					<NumbersStatsCards userId={userId} isDemo={isDemo} />
				</Suspense>
			</LayoutContent>
		</Layout>
	);
}
