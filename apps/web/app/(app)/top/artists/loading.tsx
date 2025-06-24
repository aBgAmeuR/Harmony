import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { ListSkeleton } from "~/components/list-skeleton";
import { TimeRangeSelectSkeleton } from "~/features/stats/components/time-range-select";

export default function Loading() {
	return (
		<Layout>
			<LayoutHeader items={["Stats", "Top", "Artists"]} demo={false}>
				<TimeRangeSelectSkeleton />
			</LayoutHeader>
			<LayoutContent>
				<ListSkeleton />
			</LayoutContent>
		</Layout>
	);
}
