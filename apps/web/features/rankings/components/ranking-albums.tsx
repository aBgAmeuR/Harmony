import { MusicList } from "~/components/lists/music-list";
import type { MusicListConfig } from "~/components/lists/music-list/config";
import { getRankingAlbumsData } from "../data/ranking-albums";

const config = {
    label: "albums",
    actionHref: (id) => `/detail/album/${id}?back=/rankings/albums`,
    showRank: true,
} satisfies MusicListConfig

type RankingAlbumsProps = {
    data?: Awaited<ReturnType<typeof getRankingAlbumsData>>;
    userId: string;
    isDemo: boolean;
    limit?: number;
}

export const RankingAlbums = async ({ data, userId, isDemo, limit }: RankingAlbumsProps) => {
    if (!data) {
        data = await getRankingAlbumsData(userId, isDemo, limit);
    }

    return (
        <MusicList data={data} config={config} />
    )
}