import { MusicList } from "~/components/lists/music-list";
import type { MusicListConfig } from "~/components/lists/music-list/config";
import { getRankingArtistsData } from "../data/ranking-artists";

const defaultConfig = {
    label: "artists",
    actionHref: (id) => `/detail/artist/${id}?back=/rankings/artists`,
    showRank: true,
} satisfies MusicListConfig

type RankingArtistsProps = {
    data?: Awaited<ReturnType<typeof getRankingArtistsData>>;
    userId: string;
    isDemo: boolean;
    limit?: number;
    config?: Partial<MusicListConfig>;
}

export const RankingArtists = async ({ data, userId, isDemo, limit, config }: RankingArtistsProps) => {
    if (!data) {
        data = await getRankingArtistsData(userId, isDemo, limit);
    }

    return (
        <MusicList data={data} config={{ ...defaultConfig, ...config }} />
    )
}