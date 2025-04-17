"use client";

import { Badge } from "@repo/ui/badge";
import { cn } from "@repo/ui/lib/utils";

export type TrendType = "up" | "down" | "same" | "new";

interface TrendBadgeProps {
  trend?: TrendType;
  previousRank?: number;
  showTooltip?: boolean;
}

export function TrendBadge({
  trend,
  previousRank,
}: TrendBadgeProps) {
  if (trend === "new") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "border-blue-900/30",
          "bg-blue-900/20",
          "text-blue-400",
          "px-1.5 py-0 text-xs"
        )}
      >
        New
      </Badge>
    );
  }

  if (trend === "same") {
    return null;
  }

  if (trend === "down") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "border-rose-900/30",
          "bg-rose-900/20",
          "text-rose-400",
          "px-1.5 py-0 text-xs"
        )}
      >
        from #{previousRank}
      </Badge>
    );
  }

  if (trend === "up") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "border-emerald-900/30",
          "bg-emerald-900/20",
          "text-emerald-400",
          "px-1.5 py-0 text-xs"
        )}
      >
        from #{previousRank}
      </Badge>
    );
  }
}
