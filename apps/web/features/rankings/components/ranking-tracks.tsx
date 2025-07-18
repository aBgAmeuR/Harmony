import { MusicLayout } from "~/components/lists/music-layout";
import type { MusicListConfig } from "~/components/lists/music-list/config";

import { getRankingTracksData } from "../data/ranking-tracks";

const config = {
	label: "tracks",
	showRank: true,
} satisfies MusicListConfig;

type RankingTracksProps = {
	data?: Awaited<ReturnType<typeof getRankingTracksData>>;
	userId: string;
	isDemo: boolean;
	limit?: number;
};

export const RankingTracks = async ({
	data,
	userId,
	isDemo,
	limit,
}: RankingTracksProps) => {
	data ??= await getRankingTracksData(userId, isDemo, limit);

	return <MusicLayout data={data} config={config} />;
};
