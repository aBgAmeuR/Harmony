"use client";

import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader } from "@repo/ui/card";
import { Separator } from "@repo/ui/separator";
import { Skeleton } from "@repo/ui/skeleton";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

export function MonthlyTopTracksSkeleton() {
  return (
    <div className="space-y-10">
      {/* Introduction skeleton */}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="h-8 w-56" />
        </div>
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-4" />

        {/* Legend skeleton */}
        <div className="flex flex-wrap gap-5 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-6 w-8 rounded-md" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination controls skeleton */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          disabled
          className="flex items-center gap-1"
        >
          <ChevronLeft className="size-4" />
          <span>Previous month</span>
        </Button>

        <div className="text-center">
          <Badge variant="secondary" className="font-medium px-3 py-1">
            <Skeleton className="h-4 w-16 bg-primary/20" />
          </Badge>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled
          className="flex items-center gap-1"
        >
          <span>Next month</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {/* Current month card skeleton */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <CalendarDays className="size-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <div className="flex items-center gap-3 p-4">
                {/* Rank number */}
                <div className="flex items-center justify-center w-8 text-xl font-semibold text-muted-foreground">
                  {i + 1}
                </div>

                {/* Trend indicator skeleton */}
                <Skeleton className="size-8 rounded-md" />

                {/* Album image skeleton */}
                <Skeleton className="size-12 rounded-md" />

                {/* Track info skeleton */}
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-5 w-40 mb-1" />
                  <Skeleton className="h-4 w-32 mb-1" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>

                {/* Action button skeleton */}
                <Skeleton className="size-8 rounded-md ml-auto" />
              </div>
              {i < 4 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
