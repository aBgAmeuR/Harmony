import { auth } from "@repo/auth";
import { spotify } from "@repo/spotify";
import { Alert, AlertDescription } from "@repo/ui/alert";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { ExternalLink, Info } from "lucide-react";

import { getArtistStatsAction } from "~/actions/get-artist-stats-action";

import { ArtistListeningTrends } from "./artist-listening-trends";
import { ArtistStatsSummary } from "./artist-stats-summary";

interface WrapperProps {
  artistId: string;
  userId?: string;
}

export async function ArtistStatsSummaryWrapper({
  artistId,
  userId,
}: WrapperProps) {
  const artistStats = await getArtistStatsAction(userId, artistId);
  if (!artistStats) return null;

  return <ArtistStatsSummary stats={artistStats} />;
}

export async function ArtistListeningTrendsWrapper({
  artistId,
  userId,
}: WrapperProps) {
  const artistStats = await getArtistStatsAction(userId, artistId);
  if (!artistStats) return null;

  return <ArtistListeningTrends stats={artistStats} />;
}

export async function QuickInsightsWrapper({ artistId }: WrapperProps) {
  const session = await auth();
  const artist = await spotify.artists.get(artistId);
  const artistStats = await getArtistStatsAction(session?.user?.id, artistId);
  if (!artistStats || !artist) return null;

  const avgMinutesPerTrack = (
    artistStats.totalMinutes / artistStats.totalStreams
  ).toFixed(1);
  const listenerPercentile = Math.min(
    (artistStats.monthlyAverageStreams / artist.followers.total) * 100,
    99,
  ).toFixed(1);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              Listening Habits
              <Badge variant="secondary" className="font-normal">
                Based on your history
              </Badge>
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{artistStats.monthlyAverageStreams} average monthly plays</p>
              <p>{avgMinutesPerTrack} minutes per track on average</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Peak Activity</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Most active month: {artistStats.topMonth.month}</p>
              <p>with {artistStats.topMonth.streams} plays</p>
            </div>
          </div>

          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              {"You're in the top "}
              {listenerPercentile}% of this artist's listeners based on your
              monthly activity.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Artist Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a
                href={artist.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <span>Open in Spotify</span>
                <ExternalLink className="size-3" />
              </a>
            </Button>
            {artist.uri && (
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <a
                  href={`spotify:artist:${artist.id}`}
                  className="inline-flex items-center gap-2"
                >
                  <span>Open in Spotify App</span>
                  <ExternalLink className="size-3" />
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
