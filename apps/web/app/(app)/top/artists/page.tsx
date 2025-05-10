import { Main } from "@repo/ui/components/main";
import { AppHeader } from "~/components/app-header";
import { MusicList } from "~/components/lists/music-list";
import { SelectTimeRange } from "~/components/select-time-range";
import { SelectTimeRangeInfo } from "~/components/select-time-range-info";
import TestScheduler from "~/components/test-scheduler";
import { Modals } from "./modals";

export default function TopArtistsPage() {
	return (
		<>
			<AppHeader items={["Stats", "Top", "Artists"]}>
				<SelectTimeRangeInfo />
				<TestScheduler />
				<SelectTimeRange />
				{/* // TODO: Enable this component when it's ready */}
				{/* <SelectTopLayout /> */}
			</AppHeader>
			<Main>
				<Modals>
					<MusicList type="topArtists" />
				</Modals>
			</Main>
		</>
	);
}
