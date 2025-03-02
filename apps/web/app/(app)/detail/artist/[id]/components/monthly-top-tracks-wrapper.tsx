import { spotify } from "@repo/spotify";

import { getMonthlyTopTracksAction } from "~/actions/get-monthly-top-tracks-action";

import { MonthlyTopTracks } from "./monthly-top-tracks";

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
  const artist = await spotify.artists.get(artistId);

  // Fetch monthly top tracks data
  const monthlyTopTracksData = await getMonthlyTopTracksAction(
    userId,
    artistId,
    limit,
  );

  return (
    <MonthlyTopTracks
      data={monthlyTopTracksData}
      artistName={artist?.name || "this artist"}
    />
  );
}
