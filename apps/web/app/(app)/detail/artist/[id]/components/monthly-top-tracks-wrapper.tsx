import { getMonthlyTopTracks } from "~/services/details/get-monthly-top-tracks";
import { MonthlyTopTracks } from "./monthly-top-tracks";
import { getArtistDetails } from "~/actions/get-artist-stats-action";

interface MonthlyTopTracksWrapperProps {
  artistId: string;
  limit?: number;
  userId?: string;
}

export async function MonthlyTopTracksWrapper({
  artistId,
  limit = 5,
  userId,
}: MonthlyTopTracksWrapperProps) {
  return (
    <MonthlyTopTracks
      dataPromise={getMonthlyTopTracks(
        userId,
        artistId,
        limit,
      )}
      artistNamePromise={getArtistDetails(artistId).then((artist) => artist?.name)}
    />
  );
}
