"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Separator } from "@repo/ui/separator";
import { CalendarDays, MusicIcon, User2 } from "lucide-react";

import { type MonthlyTrackData } from "~/actions/get-monthly-top-tracks-action";
import { NoDataMessage } from "~/components/no-data-message";
import { PaginationControls } from "~/components/pagination-controls";
import { TrackItem } from "~/components/track-item";
import { TrendLegend } from "~/components/trend-legend";
import { usePagination } from "~/hooks/use-pagination";

interface MonthlyTopTracksProps {
  data: MonthlyTrackData[];
  artistName: string;
}

export function MonthlyTopTracks({ data, artistName }: MonthlyTopTracksProps) {
  const {
    currentIndex,
    goToNextPage: handleNext,
    goToPreviousPage: handlePrevious,
  } = usePagination({
    totalItems: data.length,
    itemsPerPage: 1,
  });

  if (!data.length) {
    return (
      <NoDataMessage
        icon={User2}
        title="No monthly track data available"
        message={`We couldn't find any tracks from ${artistName} in your listening history.`}
      />
    );
  }

  const currentMonth = data[currentIndex];

  return (
    <div className="space-y-10">
      {/* Introduction section */}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-2">
          <MusicIcon className="size-5 text-primary" />
          <h2 className="text-2xl font-bold">Monthly Top Tracks</h2>
        </div>
        <p className="text-muted-foreground">
          This view shows your top 5 most played tracks from {artistName} for
          each month, helping you track how your listening preferences evolve
          over time. Track ranking changes are indicated with trend icons.
        </p>

        <TrendLegend />
      </div>

      {/* Month navigation */}
      <PaginationControls
        currentIndex={currentIndex}
        totalItems={data.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        prevLabel="Previous month"
        nextLabel="Next month"
      />

      {/* Current month card */}
      <MonthCard key={currentMonth.month} monthData={currentMonth} />
    </div>
  );
}

interface MonthCardProps {
  monthData: MonthlyTrackData;
}

function MonthCard({ monthData }: MonthCardProps) {
  const { month, tracks } = monthData;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span>{month}</span>
            <span className="text-sm font-normal text-muted-foreground">
              {tracks.length} tracks
            </span>
          </CardTitle>
          <CalendarDays className="size-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {tracks.length > 0 ? (
          tracks.map((track, index) => (
            <div key={track.id}>
              <TrackItem
                track={track}
                index={index}
                showAlbum={true}
                showStats={true}
                showTrend={true}
                showSpotifyLink={true}
              />
              {index < tracks.length - 1 && <Separator />}
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            No track data available for this month
          </div>
        )}
      </CardContent>
    </Card>
  );
}
