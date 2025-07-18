import { Suspense } from "react";

import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { SelectListLayout } from "~/features/stats/components/select-list-layout";
import { TimeRangeInfo } from "~/features/stats/components/time-range-info";
import { TimeRangeSelect, TimeRangeSelectSkeleton } from "~/features/stats/components/time-range-select";
import { TopArtists } from "~/features/stats/components/top-artists";
import { getUserInfos } from "~/lib/utils";

export default async function TopArtistsPage() {
	const { userId, isDemo } = await getUserInfos();

	return (
		<Layout>
			<LayoutHeader items={["Stats", "Top", "Artists"]}>
				<TimeRangeInfo />
				<Suspense fallback={<TimeRangeSelectSkeleton />}>
					<TimeRangeSelect userId={userId} isDemo={isDemo} />
				</Suspense>
				<SelectListLayout />
			</LayoutHeader>
			<LayoutContent>
				<TopArtists userId={userId} isDemo={isDemo} />
			</LayoutContent>
		</Layout>
	);
}
