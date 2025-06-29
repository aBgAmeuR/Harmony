import { DateRangeSelectorSkeleton } from "~/components/date-range-selector/date-range-selector";
import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { ListSkeleton } from "~/components/list-skeleton";

export default function Loading() {
	return (
		<Layout>
			<LayoutHeader items={["Package", "Rankings", "Tracks"]} demo={false}>
				<DateRangeSelectorSkeleton />
			</LayoutHeader>
			<LayoutContent>
				<ListSkeleton />
			</LayoutContent>
		</Layout>
	);
}
