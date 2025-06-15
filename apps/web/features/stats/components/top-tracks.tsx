import { MusicList } from "~/components/lists/music-list";
import type { MusicListConfig } from "~/components/lists/music-list/config";
import { HistoricalRankingsModal } from "~/components/modals/historical-rankings";
import { getHistoricalTrackRankings } from "~/services/historical-rankings";
import { getTopTracks } from "../data/top-tracks";

const config = {
    label: "tracks",
    showRank: true,
    showHistoricalRankings: true,
} satisfies MusicListConfig

type TopTracksProps = {
    userId: string;
    isDemo: boolean;
}

export const TopTracks = async ({ userId, isDemo }: TopTracksProps) => {
    const data = await getTopTracks(userId, isDemo);

    return (
        <HistoricalRankingsModal type="track" promise={getHistoricalTrackRankings}>
            <MusicList data={data} config={config} />
        </HistoricalRankingsModal>
    )
}