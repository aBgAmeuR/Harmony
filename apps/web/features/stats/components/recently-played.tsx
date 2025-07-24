import { getUser } from "@repo/auth";

import { MusicLayout } from "~/components/lists/music-layout";
import type { MusicListConfig } from "~/components/lists/music-list";
import { tryCatch } from "~/lib/utils";

import { getRecentlyPlayedData } from "../data/recently-played";
import { WhitelistError as WhitelistErrorComponent } from "./whitelist-error";

const config = {
	label: "tracks",
} satisfies MusicListConfig;

export const RecentlyPlayed = async () => {
	const { userId } = await getUser();

	const { data, error } = await tryCatch(getRecentlyPlayedData(userId));

	if (error?.name === "WhitelistError") {
		return <WhitelistErrorComponent />;
	}

	return <MusicLayout data={data} config={config} />;
};
