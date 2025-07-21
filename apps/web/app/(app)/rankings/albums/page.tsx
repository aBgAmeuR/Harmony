import { Suspense } from "react";

import { getUser } from "@repo/auth";

import { DateRangeSelector, DateRangeSelectorSkeleton } from "~/components/date-range-selector/date-range-selector";
import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { RankingAlbums } from "~/features/rankings/components/ranking-albums";
import { SelectListLayout } from "~/features/stats/components/select-list-layout";

export default async function RankingsAlbumsPage() {
	const { userId, isDemo } = await getUser();

	return (
		<Layout>
			<LayoutHeader items={["Package", "Rankings", "Albums"]}>
				<Suspense fallback={<DateRangeSelectorSkeleton />}>
					<DateRangeSelector />
				</Suspense>
				<SelectListLayout />
			</LayoutHeader>
			<LayoutContent>
				<RankingAlbums userId={userId} isDemo={isDemo} />
			</LayoutContent>
		</Layout>
	);
}
