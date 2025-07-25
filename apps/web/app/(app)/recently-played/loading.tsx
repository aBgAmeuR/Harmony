import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { MusicLayoutSkeleton } from "~/components/lists/music-layout/skeleton";
import { SelectListLayoutSkeleton } from "~/features/stats/components/select-list-layout";

export default function Loading() {
	return (
		<Layout>
			<LayoutHeader items={["Stats", "Recently Played"]}>
				<SelectListLayoutSkeleton />
			</LayoutHeader>
			<LayoutContent>
				<MusicLayoutSkeleton showRank={false} />
			</LayoutContent>
		</Layout>
	);
}
