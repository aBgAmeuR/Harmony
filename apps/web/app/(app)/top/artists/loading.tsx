import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { ListSkeleton } from "~/components/list-skeleton";
import { SelectTimeRangeSkeleton } from "~/components/select-time-range";

export default function Loading() {
	return (
		<Layout>
			<LayoutHeader items={["Stats", "Top", "Artists"]} demo={false}>
				<SelectTimeRangeSkeleton />
			</LayoutHeader>
			<LayoutContent>
				<ListSkeleton />
			</LayoutContent>
		</Layout>
	);
}
