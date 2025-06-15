import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { RecentlyPlayed } from "~/features/stats/components/recently-played";
import { getUserInfos } from "~/lib/utils";

export default async function RecentlyPlayedPage() {
	const { userId } = await getUserInfos();

	return (
		<Layout>
			<LayoutHeader items={["Stats", "Recently Played"]} />
			<LayoutContent>
				<RecentlyPlayed userId={userId} />
			</LayoutContent>
		</Layout>
	);
}
