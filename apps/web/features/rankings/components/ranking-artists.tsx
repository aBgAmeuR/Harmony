import { getUser } from "@repo/auth";

import { MusicLayout } from "~/components/lists/music-layout";
import type { MusicListConfig } from "~/components/lists/music-list";

import { getRankingArtistsData } from "../data/ranking-artists";

const defaultConfig = {
	label: "artists",
	actionHref: "rankingArtist",
	showRank: true,
} satisfies MusicListConfig;

type RankingArtistsProps = {
	data?: Awaited<ReturnType<typeof getRankingArtistsData>>;
	limit?: number;
	config?: Partial<MusicListConfig>;
};

export const RankingArtists = async ({ data, limit, config }: RankingArtistsProps) => {
	if (!data) {
		const { userId, isDemo } = await getUser();
		data = await getRankingArtistsData(userId, isDemo, limit);
	}

	return <MusicLayout data={data} config={{ ...defaultConfig, ...config }} />;
};
