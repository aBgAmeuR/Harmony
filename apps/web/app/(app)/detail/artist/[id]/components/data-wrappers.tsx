import { Badge } from "@repo/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";

import { getArtistListeningTrends, getArtistStatsAction } from "~/actions/get-artist-stats-action";

import { ArtistListeningTrends } from "./artist-listening-trends";
import { ArtistStatsSummary } from "./artist-stats-summary";
import { Suspense } from "react";

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
  return (
    <Suspense fallback={<h3 className="text-muted-foreground">Loading...</h3>}>
      <ArtistListeningTrends stats={getArtistListeningTrends(userId, artistId)} />
    </Suspense>
  );
}

export async function QuickInsightsWrapper({ artistId, userId }: WrapperProps) {
  const artistStats = await getArtistStatsAction(userId, artistId);
  if (!artistStats) return null;

  const avgMinutesPerTrack = (
    artistStats.totalMinutes / artistStats.totalStreams
  ).toFixed(1);

  return (
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
      </CardContent>
    </Card>
  );
}
