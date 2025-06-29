import { Suspense } from "react";

import { DateRangeSelector, DateRangeSelectorSkeleton } from "~/components/date-range-selector/date-range-selector";
import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { RankingTracks } from "~/features/rankings/components/ranking-tracks";
import { getUserInfos } from "~/lib/utils";

export default async function RankingsTracksPage() {
	const { userId, isDemo } = await getUserInfos();

	return (
		<Layout>
			<LayoutHeader items={["Package", "Rankings", "Tracks"]}>
				<Suspense fallback={<DateRangeSelectorSkeleton />}>
					<DateRangeSelector />
				</Suspense>
			</LayoutHeader>
			<LayoutContent>
				<RankingTracks userId={userId} isDemo={isDemo} />
			</LayoutContent>
		</Layout>
	);
}
