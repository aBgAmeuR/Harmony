import { MusicList } from "~/components/lists/music-list";
import type { MusicListConfig } from "~/components/lists/music-list/config";
import { getHistoricalTrackRankings } from "~/services/historical-rankings";
import { getTopTracks } from "../data/top-tracks";
import { HistoricalModal } from "./historical-modal";
import { HistoricalProvider } from "./historical-provider";

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
        <HistoricalProvider>
            <MusicList data={data} config={config} />
            <HistoricalModal promise={getHistoricalTrackRankings} />
        </HistoricalProvider>
    )
}