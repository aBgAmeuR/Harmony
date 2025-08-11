import { Suspense } from "react";
import type { Metadata } from "next";

import { DateRangeSelector, DateRangeSelectorSkeleton } from "~/components/date-range-selector/date-range-selector";
import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { ListeningSessionCard, ListeningSessionCardSkeleton } from "~/features/numbers/components/listening-session-card";
import { NumbersStatsCards, NumbersStatsCardsSkeleton } from "~/features/numbers/components/numbers-stats-cards";

export const metadata: Metadata = {
	title: "Stats Numbers",
	description: "Explore fascinating statistics about your listening habits",
};

export default async function StatsNumbersPage() {
	return (
		<Layout>
			<LayoutHeader items={["Package", "Stats", "Numbers"]} metadata={metadata}>
				<Suspense fallback={<DateRangeSelectorSkeleton />}>
					<DateRangeSelector />
				</Suspense>
			</LayoutHeader>
			<LayoutContent>
				<Suspense fallback={<ListeningSessionCardSkeleton />}>
					<ListeningSessionCard />
				</Suspense>
				<Suspense fallback={<NumbersStatsCardsSkeleton />}>
					<NumbersStatsCards />
				</Suspense>
			</LayoutContent>
		</Layout>
	);
}
