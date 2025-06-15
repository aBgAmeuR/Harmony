import { MusicList } from "~/components/lists/music-list";
import type { MusicListConfig } from "~/components/lists/music-list/config";
import { getRecentlyPlayedData } from "../data/recently-played";

const config = {
    label: "tracks",
} satisfies MusicListConfig

type RecentlyPlayedProps = {
    userId: string;
}

export const RecentlyPlayed = async ({ userId }: RecentlyPlayedProps) => {
    const data = await getRecentlyPlayedData(userId);

    return (
        <MusicList data={data} config={config} />
    )
}