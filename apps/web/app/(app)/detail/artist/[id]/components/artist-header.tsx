import React, { Suspense } from "react";
import { Button } from "@repo/ui/button";
import { NumberFlow } from "@repo/ui/components/number";
import { Skeleton } from "@repo/ui/skeleton";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";

import {
  getArtistDetails,
  getArtistStatsAction,
} from "~/actions/get-artist-stats-action";

type ArtistHeaderProps = {
  artistId: string;
  userId?: string;
};

export async function ArtistHeader({ artistId, userId }: ArtistHeaderProps) {
  const artist = await getArtistDetails(artistId);
  if (!artist) return notFound();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
      <img
        src={artist.images[0]?.url || "/placeholder.svg"}
        alt={artist.name}
        className="rounded-full shadow-lg size-24 md:size-32"
      />
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold">{artist.name}</h1>
          <Button variant="outline" size="sm" className="h-8" asChild>
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
        </div>
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Followers</p>
            <p className="text-xl font-semibold">
              <NumberFlow
                value={artist.followers.total}
                format={{ notation: "standard" }}
              />
            </p>
          </div>
          <Suspense
            fallback={
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Total Time</p>
                  <Skeleton className="h-6 w-28 mt-1" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Plays</p>
                  <Skeleton className="h-6 w-20 mt-1" />
                </div>
              </>
            }
          >
            <ArtistStats artistId={artistId} userId={userId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

const ArtistStats = async ({ artistId, userId }: ArtistHeaderProps) => {
  const artistStats = await getArtistStatsAction(userId, artistId);
  if (!artistStats) return null;

  return (
    <>
      <div>
        <p className="text-sm text-muted-foreground">Total Time</p>
        <p className="text-xl font-semibold">
          <NumberFlow
            value={artistStats.totalMinutes}
            suffix=" minutes"
            format={{ notation: "standard" }}
          />
        </p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Total Plays</p>
        <p className="text-xl font-semibold">
          <NumberFlow
            value={artistStats.totalStreams}
            format={{ notation: "standard" }}
          />
        </p>
      </div>
    </>
  );
};
