import { getTracksTabData } from "../data/tracks-tab";
import { TracksTabClient } from "./tracks-tab-client";

type TracksTabProps = {
    albumId: string;
    userId: string;
};

export const TracksTab = async ({ albumId, userId }: TracksTabProps) => {
    const tracks = await getTracksTabData(albumId, userId);

    return (
        <TracksTabClient tracks={tracks} />
    )
}