import { MusicLayout } from "~/components/lists/music-layout";
import type { MusicListConfig } from "~/components/lists/music-list/config";
import { tryCatch } from "~/lib/utils-server";

import { getRecentlyPlayedData } from "../data/recently-played";
import { WhitelistError as WhitelistErrorComponent } from "./whitelist-error";

const config = {
	label: "tracks",
} satisfies MusicListConfig;

type RecentlyPlayedProps = {
	userId: string;
};

export const RecentlyPlayed = async ({ userId }: RecentlyPlayedProps) => {
	const { data, error } = await tryCatch(getRecentlyPlayedData(userId));

	if (error?.name === "WhitelistError") {
		return <WhitelistErrorComponent />;
	}

	return <MusicLayout data={data} config={config} />;
};
