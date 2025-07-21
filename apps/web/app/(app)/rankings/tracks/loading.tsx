import { DateRangeSelectorSkeleton } from "~/components/date-range-selector/date-range-selector";
import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { MusicListSkeleton } from "~/components/lists/music-list/skeleton";
import { SelectListLayoutSkeleton } from "~/features/stats/components/select-list-layout";

export default function Loading() {
	return (
		<Layout>
			<LayoutHeader items={["Package", "Rankings", "Tracks"]} demo={false}>
				<DateRangeSelectorSkeleton />
				<SelectListLayoutSkeleton />
			</LayoutHeader>
			<LayoutContent>
				<MusicListSkeleton />
			</LayoutContent>
		</Layout>
	);
}
