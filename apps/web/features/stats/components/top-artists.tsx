import { MusicList } from "~/components/lists/music-list";
import type { MusicListConfig } from "~/components/lists/music-list/config";
import { getHistoricalArtistRankings } from "~/services/historical-rankings";
import { getTopArtists } from "../data/top-artists";
import { HistoricalModal } from "./historical-modal";
import { HistoricalProvider } from "./historical-provider";

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
        <HistoricalProvider>
            <MusicList data={data} config={config} />
            <HistoricalModal promise={getHistoricalArtistRankings} />
        </HistoricalProvider>
    )
}