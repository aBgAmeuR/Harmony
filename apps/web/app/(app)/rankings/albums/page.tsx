import { Suspense } from "react";
import type { Metadata } from "next";

import { DateRangeSelector, DateRangeSelectorSkeleton } from "~/components/date-range-selector/date-range-selector";
import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { RankingAlbums } from "~/features/rankings/components/ranking-albums";
import { SelectListLayout } from "~/features/stats/components/select-list-layout";

export const metadata: Metadata = {
	title: "Rankings Albums",
	description: "Discover your most listened to albums based on your listening history",
};

export default async function RankingsAlbumsPage() {
	return (
		<Layout>
			<LayoutHeader items={["Package", "Rankings", "Albums"]} metadata={metadata}>
				<Suspense fallback={<DateRangeSelectorSkeleton />}>
					<DateRangeSelector />
				</Suspense>
				<SelectListLayout />
			</LayoutHeader>
			<LayoutContent>
				<RankingAlbums />
			</LayoutContent>
		</Layout>
	);
}
