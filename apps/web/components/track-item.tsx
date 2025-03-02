"use client";

import { Button } from "@repo/ui/button";
import { NumberFlow } from "@repo/ui/number";
import { Clock, ExternalLink, Music } from "lucide-react";

import { getTrendColorClass, TrendBadge, TrendType } from "./trend-badge";

interface TrackItemProps {
  track: {
    id: string;
    name: string;
    image?: string;
    album?: string;
    plays?: number;
    minutes?: number;
    trend?: TrendType;
    previousRank?: number;
  };
  index: number;
  showAlbum?: boolean;
  showStats?: boolean;
  showTrend?: boolean;
  showSpotifyLink?: boolean;
}

export function TrackItem({
  track,
  index,
  showAlbum = true,
  showStats = true,
  showTrend = true,
  showSpotifyLink = true,
}: TrackItemProps) {
  return (
    <div className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
      {/* Rank number */}
      <div className="flex items-center justify-center w-8 text-xl font-semibold text-muted-foreground">
        {index + 1}
      </div>

      {/* Trend indicator */}
      {showTrend && track.trend && (
        <TrendBadge trend={track.trend} previousRank={track.previousRank} />
      )}

      {/* Track image */}
      <div className="size-12 rounded-md bg-muted/30 relative overflow-hidden">
        {track.image ? (
          <img
            src={track.image}
            alt={track.name}
            className="size-full object-cover"
          />
        ) : (
          <Music className="size-6 absolute inset-0 m-auto text-muted-foreground" />
        )}
      </div>

      {/* Track information */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-lg line-clamp-1">{track.name}</p>

        {showAlbum && track.album && (
          <p className="text-sm text-muted-foreground line-clamp-1">
            Album: {track.album}
          </p>
        )}

        {showStats &&
          (track.plays !== undefined || track.minutes !== undefined) && (
            <div className="flex gap-4 text-sm text-muted-foreground">
              {track.plays !== undefined && (
                <div className="flex items-center gap-1">
                  <Music className="size-3.5" />
                  <span>
                    <NumberFlow value={track.plays} suffix=" plays" />
                  </span>
                </div>
              )}

              {track.minutes !== undefined && (
                <div className="flex items-center gap-1">
                  <Clock className="size-3.5" />
                  <span>
                    <NumberFlow value={track.minutes} suffix=" min" />
                  </span>
                </div>
              )}

              {track.previousRank && track.trend !== "same" && (
                <div className="flex items-center gap-1 text-xs">
                  <span
                    className={`font-medium ${getTrendColorClass(track.trend)}`}
                  >
                    {track.trend === "up"
                      ? `↑ from #${track.previousRank}`
                      : `↓ from #${track.previousRank}`}
                  </span>
                </div>
              )}
            </div>
          )}
      </div>

      {/* Spotify link button */}
      {showSpotifyLink && (
        <Button variant="ghost" size="sm" className="ml-auto" asChild>
          <a
            href={`https://open.spotify.com/track/${track.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1"
          >
            <span className="sr-only">Open in Spotify</span>
            <ExternalLink className="size-4" />
          </a>
        </Button>
      )}
    </div>
  );
}
