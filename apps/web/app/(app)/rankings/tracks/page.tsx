import { Suspense } from "react";
import type { Metadata } from "next";

import { DateRangeSelector, DateRangeSelectorSkeleton } from "~/components/date-range-selector/date-range-selector";
import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { RankingTracks } from "~/features/rankings/components/ranking-tracks";
import { SelectListLayout } from "~/features/stats/components/select-list-layout";

export const metadata: Metadata = {
	title: "Rankings Tracks",
	description: "Discover your most listened to tracks based on your listening history",
};

export default async function RankingsTracksPage() {
	return (
		<Layout>
			<LayoutHeader items={["Package", "Rankings", "Tracks"]} metadata={metadata}>
				<Suspense fallback={<DateRangeSelectorSkeleton />}>
					<DateRangeSelector />
				</Suspense>
				<SelectListLayout />
			</LayoutHeader>
			<LayoutContent>
				<RankingTracks />
			</LayoutContent>
		</Layout>
	);
}
