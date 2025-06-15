import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { SelectTimeRange } from "~/components/select-time-range";
import { SelectTimeRangeInfo } from "~/components/select-time-range-info";
import { TopTracks } from "~/features/stats/components/top-tracks";
import { getUserInfos } from "~/lib/utils";

export default async function TopTracksPage() {
	const { userId, isDemo } = await getUserInfos();

	return (
		<Layout>
			<LayoutHeader items={["Stats", "Top", "Tracks"]}>
				<SelectTimeRangeInfo />
				<SelectTimeRange />
				{/* // TODO: Enable this component when it's ready */}
				{/* <SelectTopLayout /> */}
			</LayoutHeader>
			<LayoutContent>
				<TopTracks userId={userId} isDemo={isDemo} />
			</LayoutContent>
		</Layout>
	);
}
