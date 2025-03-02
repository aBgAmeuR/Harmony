"use client";

import { Badge } from "@repo/ui/badge";
import { ArrowRight, Star, TrendingDown, TrendingUp } from "lucide-react";

interface TrendLegendProps {
  showImproved?: boolean;
  showDecreased?: boolean;
  showNoChange?: boolean;
  showNewEntry?: boolean;
}

export function TrendLegend({
  showImproved = true,
  showDecreased = true,
  showNoChange = true,
  showNewEntry = true,
}: TrendLegendProps) {
  return (
    <div className="flex flex-wrap gap-5 mt-4">
      {showImproved && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="flex gap-1 p-1">
            <TrendingUp className="size-3 text-emerald-500" />
          </Badge>
          <span>Improved ranking</span>
        </div>
      )}

      {showDecreased && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="flex gap-1 p-1">
            <TrendingDown className="size-3 text-red-500" />
          </Badge>
          <span>Decreased ranking</span>
        </div>
      )}

      {showNoChange && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="flex gap-1 p-1">
            <ArrowRight className="size-3 text-amber-500" />
          </Badge>
          <span>No change</span>
        </div>
      )}

      {showNewEntry && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="flex gap-1 p-1">
            <Star className="size-3 text-blue-500" />
          </Badge>
          <span>New entry</span>
        </div>
      )}
    </div>
  );
}
