import { MusicList } from "~/components/lists/music-list";
import type { MusicListConfig } from "~/components/lists/music-list/config";
import { getRankingTracksData } from "../data/ranking-tracks";

const config = {
    label: "tracks",
    showRank: true,
} satisfies MusicListConfig

type RankingTracksProps = {
    data?: Awaited<ReturnType<typeof getRankingTracksData>>;
    userId: string;
    isDemo: boolean;
    limit?: number;
}

export const RankingTracks = async ({ data, userId, isDemo, limit }: RankingTracksProps) => {
    if (!data) {
        data = await getRankingTracksData(userId, isDemo, limit);
    }

    return (
        <MusicList data={data} config={config} />
    )
}