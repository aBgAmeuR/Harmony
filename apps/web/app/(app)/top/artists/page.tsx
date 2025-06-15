import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { SelectTimeRange } from "~/components/select-time-range";
import { SelectTimeRangeInfo } from "~/components/select-time-range-info";
import { TopArtists } from "~/features/stats/components/top-artists";
import { getUserInfos } from "~/lib/utils";

export default async function TopArtistsPage() {
	const { userId, isDemo } = await getUserInfos();

	return (
		<Layout>
			<LayoutHeader items={["Stats", "Top", "Artists"]}>
				<SelectTimeRangeInfo />
				<SelectTimeRange />
				{/* // TODO: Enable this component when it's ready */}
				{/* <SelectTopLayout /> */}
			</LayoutHeader>
			<LayoutContent>
				<TopArtists userId={userId} isDemo={isDemo} />
			</LayoutContent>
		</Layout>
	);
}
