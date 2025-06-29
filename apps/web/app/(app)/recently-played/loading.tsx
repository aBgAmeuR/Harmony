import {
	Layout,
	LayoutContent,
	LayoutHeader,
} from "~/components/layouts/layout";
import { ListSkeleton } from "~/components/list-skeleton";

export default function Loading() {
	return (
		<Layout>
			<LayoutHeader items={["Stats", "Recently Played"]} />
			<LayoutContent>
				<ListSkeleton showRank={false} />
			</LayoutContent>
		</Layout>
	);
}
