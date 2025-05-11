import { Main } from "@repo/ui/components/main";
import { AppHeader } from "~/components/app-header";
import { MusicList } from "~/components/lists/music-list";
import { HistoricalRankingsModal } from "~/components/modals/historical-rankings";
import { SelectTimeRange } from "~/components/select-time-range";
import { SelectTimeRangeInfo } from "~/components/select-time-range-info";
import { getHistoricalTrackRankings } from "~/services/historical-rankings";

export default async function TopTracksPage() {
	return (
		<>
			<AppHeader items={["Stats", "Top", "Tracks"]}>
				<SelectTimeRangeInfo />
				<SelectTimeRange />
				{/* // TODO: Enable this component when it's ready */}
				{/* <SelectTopLayout /> */}
			</AppHeader>
			<Main>
				<HistoricalRankingsModal
					type="track"
					getHistoricalRankings={getHistoricalTrackRankings}
				>
					<MusicList type="topTracks" />
				</HistoricalRankingsModal>
			</Main>
		</>
	);
}
