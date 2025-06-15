import { MusicList } from "~/components/lists/music-list";
import type { MusicListConfig } from "~/components/lists/music-list/config";
import { HistoricalRankingsModal } from "~/components/modals/historical-rankings";
import { getHistoricalArtistRankings } from "~/services/historical-rankings";
import { getTopArtists } from "../data/top-artists";

const config = {
    label: "artists",
    showRank: true,
    showHistoricalRankings: true,
} satisfies MusicListConfig

type TopArtistsProps = {
    userId: string;
    isDemo: boolean;
}

export const TopArtists = async ({ userId, isDemo }: TopArtistsProps) => {
    const data = await getTopArtists(userId, isDemo);

    return (
        <HistoricalRankingsModal type="artist" promise={getHistoricalArtistRankings}>
            <MusicList data={data} config={config} />
        </HistoricalRankingsModal>
    )
}