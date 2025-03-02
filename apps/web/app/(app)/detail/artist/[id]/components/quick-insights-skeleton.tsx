"use client";

import { Alert } from "@repo/ui/alert";
import { Card, CardContent, CardHeader } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";
import { Info } from "lucide-react";

export function QuickInsightsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Quick Insights Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-36 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>

          <div>
            <Skeleton className="h-5 w-28 mb-2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>

          <Alert className="bg-muted/50 border-muted">
            <Info className="size-4 text-muted-foreground/50" />
            <div className="ml-2 space-y-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </Alert>
        </CardContent>
      </Card>

      {/* Artist Links Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <Skeleton className="h-9 w-full rounded-md" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
