"use client";

import { Badge } from "@repo/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/tooltip";
import { ArrowRight, Star, TrendingDown, TrendingUp } from "lucide-react";

export type TrendType = "up" | "down" | "same" | "new";

interface TrendBadgeProps {
  trend?: TrendType;
  previousRank?: number;
  showTooltip?: boolean;
}

export function TrendBadge({
  trend,
  previousRank,
  showTooltip = true,
}: TrendBadgeProps) {
  const badge = (
    <Badge
      variant="outline"
      className={`${getTrendBackgroundClass(trend)} ${getTrendBorderClass(trend)}`}
    >
      {getTrendIcon(trend)}
    </Badge>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center">{badge}</div>
        </TooltipTrigger>
        <TooltipContent side="top">
          {getRankingMessage(trend, previousRank)}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function getTrendIcon(trend?: TrendType) {
  switch (trend) {
    case "up":
      return <TrendingUp className="size-4 text-emerald-500" />;
    case "down":
      return <TrendingDown className="size-4 text-red-500" />;
    case "same":
      return <ArrowRight className="size-4 text-amber-500" />;
    case "new":
    default:
      return <Star className="size-4 text-blue-500" />;
  }
}

export function getTrendBackgroundClass(trend?: TrendType) {
  switch (trend) {
    case "up":
      return "bg-emerald-500/10";
    case "down":
      return "bg-red-500/10";
    case "same":
      return "bg-amber-500/10";
    case "new":
    default:
      return "bg-blue-500/10";
  }
}

export function getTrendBorderClass(trend?: TrendType) {
  switch (trend) {
    case "up":
      return "border-emerald-500/30";
    case "down":
      return "border-red-500/30";
    case "same":
      return "border-amber-500/30";
    case "new":
    default:
      return "border-blue-500/30";
  }
}

export function getTrendColorClass(trend?: TrendType) {
  switch (trend) {
    case "up":
      return "text-emerald-500";
    case "down":
      return "text-red-500";
    case "same":
      return "text-amber-500";
    case "new":
    default:
      return "text-blue-500";
  }
}

export function getRankingMessage(trend?: TrendType, previousRank?: number) {
  switch (trend) {
    case "up":
      return `Moved up from position #${previousRank}`;
    case "down":
      return `Moved down from position #${previousRank}`;
    case "same":
      return "No change in ranking";
    case "new":
    default:
      return "New entry this month";
  }
}
