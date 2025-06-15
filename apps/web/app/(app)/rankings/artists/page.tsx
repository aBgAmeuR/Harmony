import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { SelectMonthRange } from "~/components/select-month-range";
import { RankingArtists } from "~/features/rankings/components/ranking-artists";
import { getUserInfos } from "~/lib/utils";

export default async function RankingsArtistsPage() {
	const { userId, isDemo } = await getUserInfos();

	return (
		<Layout>
			<LayoutHeader items={["Package", "Rankings", "Artists"]}>
				<SelectMonthRange />
			</LayoutHeader>
			<LayoutContent>
				<RankingArtists userId={userId} isDemo={isDemo} />
			</LayoutContent>
		</Layout>
	);
}
