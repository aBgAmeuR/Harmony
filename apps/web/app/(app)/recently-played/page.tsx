import { getUser } from "@repo/auth";

import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { RecentlyPlayed } from "~/features/stats/components/recently-played";
import { SelectListLayout } from "~/features/stats/components/select-list-layout";

export default async function RecentlyPlayedPage() {
	const { userId } = await getUser();

	return (
		<Layout>
			<LayoutHeader items={["Stats", "Recently Played"]}>
				<SelectListLayout />
			</LayoutHeader>
			<LayoutContent>
				<RecentlyPlayed userId={userId} />
			</LayoutContent>
		</Layout>
	);
}
