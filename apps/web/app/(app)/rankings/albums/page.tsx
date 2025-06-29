import { Suspense } from "react";

import { DateRangeSelector, DateRangeSelectorSkeleton } from "~/components/date-range-selector/date-range-selector";
import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { RankingAlbums } from "~/features/rankings/components/ranking-albums";
import { getUserInfos } from "~/lib/utils";

export default async function RankingsAlbumsPage() {
	const { userId, isDemo } = await getUserInfos();

	return (
		<Layout>
			<LayoutHeader items={["Package", "Rankings", "Albums"]}>
				<Suspense fallback={<DateRangeSelectorSkeleton />}>
					<DateRangeSelector />
				</Suspense>
			</LayoutHeader>
			<LayoutContent>
				<RankingAlbums userId={userId} isDemo={isDemo} />
			</LayoutContent>
		</Layout>
	);
}
