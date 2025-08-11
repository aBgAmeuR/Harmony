import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { MusicLayoutSkeleton } from "~/components/lists/music-layout/skeleton";
import { SelectListLayoutSkeleton } from "~/features/stats/components/select-list-layout";

import { metadata } from "./page";

export { metadata };

export default function Loading() {
	return (
		<Layout>
			<LayoutHeader items={["Stats", "Recently Played"]} demo={false} metadata={metadata}>
				<SelectListLayoutSkeleton />
			</LayoutHeader>
			<LayoutContent>
				<MusicLayoutSkeleton showRank={false} />
			</LayoutContent>
		</Layout>
	);
}
