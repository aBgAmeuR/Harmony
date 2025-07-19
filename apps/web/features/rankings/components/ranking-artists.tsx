import { MusicLayout } from "~/components/lists/music-layout";
import type { MusicListConfig } from "~/components/lists/music-list/config";

import { getRankingArtistsData } from "../data/ranking-artists";

const defaultConfig = {
	label: "artists",
	actionHref: "rankingArtist",
	showRank: true,
} satisfies MusicListConfig;

type RankingArtistsProps = {
	data?: Awaited<ReturnType<typeof getRankingArtistsData>>;
	userId: string;
	isDemo: boolean;
	limit?: number;
	config?: Partial<MusicListConfig>;
};

export const RankingArtists = async ({
	data,
	userId,
	isDemo,
	limit,
	config,
}: RankingArtistsProps) => {
	data ??= await getRankingArtistsData(userId, isDemo, limit);

	return <MusicLayout data={data} config={{ ...defaultConfig, ...config }} />;
};
