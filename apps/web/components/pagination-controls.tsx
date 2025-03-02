"use client";

import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentIndex: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
  showItemCount?: boolean;
  prevLabel?: string;
  nextLabel?: string;
}

export function PaginationControls({
  currentIndex,
  totalItems,
  onPrevious,
  onNext,
  showItemCount = true,
  prevLabel = "Previous",
  nextLabel = "Next",
}: PaginationControlsProps) {
  const hasNext = currentIndex < totalItems - 1;
  const hasPrevious = currentIndex > 0;

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={!hasPrevious}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="size-4" />
        <span>{prevLabel}</span>
      </Button>

      {showItemCount && (
        <div className="text-center">
          <Badge variant="secondary" className="font-medium px-3 py-1">
            {currentIndex + 1} of {totalItems}
          </Badge>
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={!hasNext}
        className="flex items-center gap-1"
      >
        <span>{nextLabel}</span>
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
