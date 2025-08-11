import { getUser } from "@repo/auth";

import { MusicLayout } from "~/components/lists/music-layout";
import type { MusicListConfig } from "~/components/lists/music-list";

import { getRankingAlbumsData } from "../data/ranking-albums";

const config = {
	label: "albums",
	actionHref: "rankingAlbum",
	showRank: true,
} satisfies MusicListConfig;

type RankingAlbumsProps = {
	data?: Awaited<ReturnType<typeof getRankingAlbumsData>>;
	limit?: number;
};

export const RankingAlbums = async ({ data, limit }: RankingAlbumsProps) => {
	const { userId, isDemo } = await getUser();

	data ??= await getRankingAlbumsData(userId, isDemo, limit);

	return <MusicLayout data={data} config={config} />;
};
