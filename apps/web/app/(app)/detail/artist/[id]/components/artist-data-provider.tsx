import { auth } from "@repo/auth";
import { spotify } from "@repo/spotify";

import { getArtistStatsAction } from "~/actions/get-artist-stats-action";

export async function ArtistDataProvider({
  artistId,
  children,
}: {
  artistId: string;
  // eslint-disable-next-line no-unused-vars
  children: (props: { artist: any; artistStats: any }) => React.ReactNode;
}) {
  const session = await auth();
  const artist = await spotify.artists.get(artistId);

  // Fetch artist statistics in parallel with the artist data
  const artistStats = await getArtistStatsAction(session?.user?.id, artistId);

  return children({ artist, artistStats });
}
