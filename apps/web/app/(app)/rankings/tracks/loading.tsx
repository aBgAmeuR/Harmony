import { DateRangeSelectorSkeleton } from "~/components/date-range-selector/date-range-selector";
import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { MusicLayoutSkeleton } from "~/components/lists/music-layout/skeleton";
import { SelectListLayoutSkeleton } from "~/features/stats/components/select-list-layout";

import { metadata } from "./page";

export { metadata };

export default function Loading() {
	return (
		<Layout>
			<LayoutHeader items={["Package", "Rankings", "Tracks"]} demo={false} metadata={metadata}>
				<DateRangeSelectorSkeleton />
				<SelectListLayoutSkeleton />
			</LayoutHeader>
			<LayoutContent>
				<MusicLayoutSkeleton />
			</LayoutContent>
		</Layout>
	);
}
