"use client";

import { Card, CardContent, CardHeader } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";
import { Brain, Gauge } from "lucide-react";

export function ArtistListeningTrendsSkeleton() {
  return (
    <div className="grid gap-4">
      {/* Monthly Listening Activity */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="aspect-[16/9] w-full">
            <Skeleton className="size-full" />
          </div>
        </CardContent>
      </Card>

      {/* Stream Efficiency Analysis */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-5 w-44" />
          <Gauge className="size-4 text-muted-foreground/50" />
        </CardHeader>
        <CardContent>
          <div className="aspect-[21/9] w-full">
            <Skeleton className="size-full" />
          </div>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-muted-foreground/30" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-muted-foreground/30" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Distribution */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-5 w-36" />
          <Brain className="size-4 text-muted-foreground/50" />
        </CardHeader>
        <CardContent>
          <div className="aspect-[21/9] w-full">
            <Skeleton className="size-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
