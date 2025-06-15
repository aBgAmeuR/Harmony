import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { ListSkeleton } from "~/components/list-skeleton";
import { SelectMonthRangeSkeleton } from "~/components/select-month-range";

export default function Loading() {
	return (
		<Layout>
			<LayoutHeader items={["Package", "Rankings", "Tracks"]} demo={false}>
				<SelectMonthRangeSkeleton />
			</LayoutHeader>
			<LayoutContent>
				<ListSkeleton />
			</LayoutContent>
		</Layout>
	);
}
