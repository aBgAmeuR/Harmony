import type { MusicItemCardProps } from "~/components/cards/music-item-card/type";
import {
	getRankingAlbums,
	getRankingArtists,
	getRankingTracks,
	getRecentlyPlayedTracks,
	getTopArtists,
	getTopTracks,
} from "~/services/music-lists";

type Config = {
	[key: string]: {
		action: (
			userId: string | undefined,
		) => Promise<MusicItemCardProps["item"][] | null>;
		label: string;
		actionHref?: (string: string) => string;
		showRank?: boolean;
		showHistoricalRankings?: boolean;
	};
};

export const musicListConfig: Config = {
	rankingTracks: {
		action: getRankingTracks,
		label: "tracks",
		showRank: true,
	},
	rankingArtists: {
		action: getRankingArtists,
		label: "artists",
		actionHref: (id) => `/detail/artist/${id}?back=/rankings/artists`,
		showRank: true,
	},
	rankingAlbums: {
		action: getRankingAlbums,
		label: "albums",
		actionHref: (id) => `/detail/album/${id}?back=/rankings/albums`,
		showRank: true,
	},
	topTracks: {
		action: getTopTracks,
		label: "tracks",
		showRank: true,
		showHistoricalRankings: true,
	},
	topArtists: {
		action: getTopArtists,
		label: "artists",
		showRank: true,
		showHistoricalRankings: true,
	},
	recentlyPlayed: {
		action: getRecentlyPlayedTracks,
		label: "tracks",
	},
	dashboardTracks: {
		action: getRankingTracks,
		label: "tracks",
		showRank: true,
	},
	dashboardArtists: {
		action: getRankingArtists,
		label: "artists",
		showRank: true,
	},
} as const;
