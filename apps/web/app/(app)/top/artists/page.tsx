import { Suspense } from "react";

import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { SelectListLayout } from "~/features/stats/components/select-list-layout";
import { TimeRangeInfo } from "~/features/stats/components/time-range-info";
import { TimeRangeSelect, TimeRangeSelectSkeleton } from "~/features/stats/components/time-range-select";
import { TopArtists } from "~/features/stats/components/top-artists";

export default async function TopArtistsPage() {
	return (
		<Layout>
			<LayoutHeader items={["Stats", "Top", "Artists"]}>
				<TimeRangeInfo />
				<Suspense fallback={<TimeRangeSelectSkeleton />}>
					<TimeRangeSelect />
				</Suspense>
				<SelectListLayout />
			</LayoutHeader>
			<LayoutContent>
				<TopArtists />
			</LayoutContent>
		</Layout>
	);
}
