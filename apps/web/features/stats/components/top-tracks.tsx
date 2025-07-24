import { getUser } from "@repo/auth";

import { MusicLayout } from "~/components/lists/music-layout";
import type { MusicListConfig } from "~/components/lists/music-list";
import { tryCatch } from "~/lib/utils";
import { getHistoricalTrackRankings } from "~/services/historical-rankings";

import { getTopTracks } from "../data/top-tracks";
import { HistoricalModal } from "./historical-modal";
import { HistoricalProvider } from "./historical-provider";
import { WhitelistError as WhitelistErrorComponent } from "./whitelist-error";

const config = {
	label: "tracks",
	showRank: true,
	showHistoricalRankings: true,
} satisfies MusicListConfig;

export const TopTracks = async () => {
	const { userId, isDemo } = await getUser();

	const { data, error } = await tryCatch(getTopTracks(userId, isDemo));

	if (error?.name === "WhitelistError") {
		return <WhitelistErrorComponent />;
	}

	return (
		<HistoricalProvider>
			<MusicLayout data={data} config={config} />
			<HistoricalModal promise={getHistoricalTrackRankings} />
		</HistoricalProvider>
	);
};
