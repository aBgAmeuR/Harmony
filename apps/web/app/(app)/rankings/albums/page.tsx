import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { SelectMonthRange } from "~/components/select-month-range";
import { RankingAlbums } from "~/features/rankings/components/ranking-albums";
import { getUserInfos } from "~/lib/utils";

export default async function RankingsAlbumsPage() {
	const { userId, isDemo } = await getUserInfos();

	return (
		<Layout>
			<LayoutHeader items={["Package", "Rankings", "Albums"]}>
				<SelectMonthRange />
			</LayoutHeader>
			<LayoutContent>
				<RankingAlbums userId={userId} isDemo={isDemo} />
			</LayoutContent>
		</Layout>
	);
}
