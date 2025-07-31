import { getUser } from "@repo/auth";

import { MusicLayout } from "~/components/lists/music-layout";
import type { MusicListConfig } from "~/components/lists/music-list";
import { tryCatch } from "~/lib/utils";

import { getHistoricalArtistRankingsAction } from "../actions/historical-rankings-actions";
import { getTopArtists } from "../data/top-artists";
import { HistoricalModal } from "./historical-modal";
import { HistoricalProvider } from "./historical-provider";
import { WhitelistError as WhitelistErrorComponent } from "./whitelist-error";

const config = {
	label: "artists",
	showRank: true,
	showHistoricalRankings: true,
} satisfies MusicListConfig;

export const TopArtists = async () => {
	const { userId, isDemo } = await getUser();

	const { data, error } = await tryCatch(getTopArtists(userId, isDemo));

	if (error?.name === "WhitelistError") {
		return <WhitelistErrorComponent />;
	}

	return (
		<HistoricalProvider>
			<MusicLayout data={data} config={config} />
			<HistoricalModal promise={getHistoricalArtistRankingsAction} />
		</HistoricalProvider>
	);
};
