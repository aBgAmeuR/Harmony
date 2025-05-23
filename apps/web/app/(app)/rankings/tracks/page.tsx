import { Main } from "@repo/ui/components/main";
import { AppHeader } from "~/components/app-header";
import { MusicList } from "~/components/lists/music-list";
import { SelectMonthRange } from "~/components/select-month-range";

export default function RankingsTracksPage() {
	return (
		<>
			<AppHeader items={["Package", "Rankings", "Tracks"]}>
				<SelectMonthRange />
			</AppHeader>
			<Main>
				<MusicList type="rankingTracks" />
			</Main>
		</>
	);
}
