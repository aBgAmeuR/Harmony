import { MusicLayout } from "~/components/lists/music-layout";
import type { MusicListConfig } from "~/components/lists/music-list";

import { getRankingTracksData } from "../data/ranking-tracks";

const defaultConfig = {
	label: "tracks",
	showRank: true,
} satisfies MusicListConfig;

type RankingTracksProps = {
	data?: Awaited<ReturnType<typeof getRankingTracksData>>;
	userId: string;
	isDemo: boolean;
	limit?: number;
	config?: Partial<MusicListConfig>;
};

export const RankingTracks = async ({
	data,
	userId,
	isDemo,
	limit,
	config,
}: RankingTracksProps) => {
	data ??= await getRankingTracksData(userId, isDemo, limit);

	return <MusicLayout data={data} config={{ ...defaultConfig, ...config }} />;
};
