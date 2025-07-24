import { DateRangeSelectorSkeleton } from "~/components/date-range-selector/date-range-selector";
import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { MusicLayoutSkeleton } from "~/components/lists/music-layout/skeleton";
import { SelectListLayoutSkeleton } from "~/features/stats/components/select-list-layout";

export default function Loading() {
	return (
		<Layout>
			<LayoutHeader items={["Package", "Rankings", "Tracks"]} demo={false}>
				<DateRangeSelectorSkeleton />
				<SelectListLayoutSkeleton />
			</LayoutHeader>
			<LayoutContent>
				<MusicLayoutSkeleton />
			</LayoutContent>
		</Layout>
	);
}
