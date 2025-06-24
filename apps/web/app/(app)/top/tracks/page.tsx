import { Suspense } from "react";
import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { SelectListLayout } from "~/features/stats/components/select-list-layout";
import { TimeRangeInfo } from "~/features/stats/components/time-range-info";
import { TimeRangeSelect, TimeRangeSelectSkeleton } from "~/features/stats/components/time-range-select";
import { TopTracks } from "~/features/stats/components/top-tracks";
import { getUserInfos } from "~/lib/utils";

export default async function TopTracksPage() {
	const { userId, isDemo } = await getUserInfos();

	return (
		<Layout>
			<LayoutHeader items={["Stats", "Top", "Tracks"]}>
				<TimeRangeInfo />
				<Suspense fallback={<TimeRangeSelectSkeleton />}>
					<TimeRangeSelect userId={userId} isDemo={isDemo} />
				</Suspense>
				{/* // TODO: Enable this component when it's ready */}
				{/* <SelectListLayout /> */}
			</LayoutHeader>
			<LayoutContent>
				<TopTracks userId={userId} isDemo={isDemo} />
			</LayoutContent>
		</Layout>
	);
}
