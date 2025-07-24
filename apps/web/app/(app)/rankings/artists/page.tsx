import { Suspense } from "react";

import { DateRangeSelector, DateRangeSelectorSkeleton } from "~/components/date-range-selector/date-range-selector";
import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { RankingArtists } from "~/features/rankings/components/ranking-artists";
import { SelectListLayout } from "~/features/stats/components/select-list-layout";

export default async function RankingsArtistsPage() {
	return (
		<Layout>
			<LayoutHeader items={["Package", "Rankings", "Artists"]}>
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
