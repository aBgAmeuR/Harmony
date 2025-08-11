import { getUser } from "@repo/auth";

import { getTracksTabData } from "../data/tracks-tab";
import { TracksTabClient } from "./tracks-tab-client";

type TracksTabProps = {
	albumId: string;
};

export const TracksTab = async ({ albumId }: TracksTabProps) => {
	const { userId } = await getUser();
	const tracks = await getTracksTabData(albumId, userId);

	return <TracksTabClient tracks={tracks} />;
};
