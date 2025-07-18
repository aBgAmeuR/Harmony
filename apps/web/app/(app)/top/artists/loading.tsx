import { cookies } from "next/headers";

import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { MusicLayoutSkeleton } from "~/components/lists/music-layout/skeleton";
import { SelectListLayoutSkeleton } from "~/features/stats/components/select-list-layout";
import { TimeRangeSelectSkeleton } from "~/features/stats/components/time-range-select";

export default async function Loading() {
	const cookieStore = await cookies();
	const listLayout = cookieStore.get("list-layout|state|list_layout")?.value;

	return (
		<Layout>
			<LayoutHeader items={["Stats", "Top", "Artists"]} demo={false}>
				<TimeRangeSelectSkeleton />
				<SelectListLayoutSkeleton />
			</LayoutHeader>
			<LayoutContent>
				<MusicLayoutSkeleton layout={listLayout === "grid" ? "grid" : "list"} />
			</LayoutContent>
		</Layout>
	);
}
