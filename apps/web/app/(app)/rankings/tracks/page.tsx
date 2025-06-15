import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { SelectMonthRange } from "~/components/select-month-range";
import { RankingTracks } from "~/features/rankings/components/ranking-tracks";
import { getUserInfos } from "~/lib/utils";

export default async function RankingsTracksPage() {
	const { userId, isDemo } = await getUserInfos();

	return (
		<Layout>
			<LayoutHeader items={["Package", "Rankings", "Tracks"]}>
				<SelectMonthRange />
			</LayoutHeader>
			<LayoutContent>
				<RankingTracks userId={userId} isDemo={isDemo} />
			</LayoutContent>
		</Layout>
	);
}
