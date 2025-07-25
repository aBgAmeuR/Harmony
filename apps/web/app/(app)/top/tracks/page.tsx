import { Suspense } from "react";
import type { Metadata } from "next";

import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { SelectListLayout } from "~/features/stats/components/select-list-layout";
import { TimeRangeInfo } from "~/features/stats/components/time-range-info";
import { TimeRangeSelect, TimeRangeSelectSkeleton } from "~/features/stats/components/time-range-select";
import { TopTracks } from "~/features/stats/components/top-tracks";

export const metadata: Metadata = {
	title: "Top Tracks",
	description: "Discover your most listened to tracks on Spotify, ranked by play count and listening time",
};

export default async function TopTracksPage() {
	return (
		<Layout>
			<LayoutHeader items={["Stats", "Top", "Tracks"]} metadata={metadata}>
				<TimeRangeInfo />
				<Suspense fallback={<TimeRangeSelectSkeleton />}>
					<TimeRangeSelect />
				</Suspense>
				<SelectListLayout />
			</LayoutHeader>
			<LayoutContent>
				<TopTracks />
			</LayoutContent>
		</Layout>
	);
}
