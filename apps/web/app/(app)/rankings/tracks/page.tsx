import { Suspense } from "react";

import { DateRangeSelector, DateRangeSelectorSkeleton } from "~/components/date-range-selector/date-range-selector";
import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { RankingTracks } from "~/features/rankings/components/ranking-tracks";
import { SelectListLayout } from "~/features/stats/components/select-list-layout";
import { getUserInfos } from "~/lib/utils-server";

export default async function RankingsTracksPage() {
	const { userId, isDemo } = await getUserInfos();

	return (
		<Layout>
			<LayoutHeader items={["Package", "Rankings", "Tracks"]}>
				<Suspense fallback={<DateRangeSelectorSkeleton />}>
					<DateRangeSelector />
				</Suspense>
				<SelectListLayout />
			</LayoutHeader>
			<LayoutContent>
				<RankingTracks userId={userId} isDemo={isDemo} />
			</LayoutContent>
		</Layout>
	);
}
