"use client";

import { Button } from "@repo/ui/button";
import { Skeleton } from "@repo/ui/skeleton";
import { ExternalLink } from "lucide-react";

export function ArtistHeaderSkeleton() {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
      <Skeleton className="rounded-full shadow-lg size-24 md:size-32" />
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-2">
          <Skeleton className="h-10 w-60" />
          <Button
            variant="outline"
            size="sm"
            className="h-8 opacity-50"
            disabled
          >
            <span>Open in Spotify</span>
            <ExternalLink className="size-3 ml-2" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-6 mt-3">
          <div>
            <p className="text-sm text-muted-foreground">Followers</p>
            <Skeleton className="h-6 w-24 mt-1" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Time</p>
            <Skeleton className="h-6 w-28 mt-1" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Plays</p>
            <Skeleton className="h-6 w-20 mt-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
