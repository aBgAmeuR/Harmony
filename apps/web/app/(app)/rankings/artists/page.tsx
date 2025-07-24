import { Suspense } from "react";
import type { Metadata } from "next";

import { DateRangeSelector, DateRangeSelectorSkeleton } from "~/components/date-range-selector/date-range-selector";
import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { RankingArtists } from "~/features/rankings/components/ranking-artists";
import { SelectListLayout } from "~/features/stats/components/select-list-layout";

export const metadata: Metadata = {
	title: "Rankings Artists",
	description: "Discover your most listened to artists based on your listening history",
};

export default async function RankingsArtistsPage() {
	return (
		<Layout>
			<LayoutHeader items={["Package", "Rankings", "Artists"]} metadata={metadata}>
				<Suspense fallback={<DateRangeSelectorSkeleton />}>
					<DateRangeSelector />
				</Suspense>
				<SelectListLayout />
			</LayoutHeader>
			<LayoutContent>
				<RankingArtists />
			</LayoutContent>
		</Layout>
	);
}
