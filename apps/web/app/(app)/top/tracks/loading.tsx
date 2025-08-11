import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { MusicLayoutSkeleton } from "~/components/lists/music-layout/skeleton";
import { SelectListLayoutSkeleton } from "~/features/stats/components/select-list-layout";
import { TimeRangeSelectSkeleton } from "~/features/stats/components/time-range-select";

import { metadata } from "./page";

export { metadata };

export default async function Loading() {
	return (
		<Layout>
			<LayoutHeader items={["Stats", "Top", "Tracks"]} demo={false} metadata={metadata}>
				<TimeRangeSelectSkeleton />
				<SelectListLayoutSkeleton />
			</LayoutHeader>
			<LayoutContent>
				<MusicLayoutSkeleton />
			</LayoutContent>
		</Layout>
	);
}
