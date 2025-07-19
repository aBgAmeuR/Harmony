import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { RecentlyPlayed } from "~/features/stats/components/recently-played";
import { SelectListLayout } from "~/features/stats/components/select-list-layout";
import { getUserInfos } from "~/lib/utils-server";

export default async function RecentlyPlayedPage() {
	const { userId } = await getUserInfos();

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
