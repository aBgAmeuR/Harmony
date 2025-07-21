import { cookies } from "next/headers";

import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { MusicListSkeleton } from "~/components/lists/music-list/skeleton";
import { SelectListLayoutSkeleton } from "~/features/stats/components/select-list-layout";
import { TimeRangeSelectSkeleton } from "~/features/stats/components/time-range-select";

export default async function Loading() {
	const cookieStore = await cookies();
	const listLayout = cookieStore.get("list-layout|state|list_layout")?.value;

	return (
		<Layout>
			<LayoutHeader items={["Stats", "Top", "Tracks"]} demo={false}>
				<TimeRangeSelectSkeleton />
				<SelectListLayoutSkeleton />
			</LayoutHeader>
			<LayoutContent>
				<MusicListSkeleton layout={listLayout === "grid" ? "grid" : "list"} />
			</LayoutContent>
		</Layout>
	);
}
