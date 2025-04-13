"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";
import { cn } from "@repo/ui/lib/utils";

type ChartCardProps = React.PropsWithChildren<{
  title: string;
  description: string;
  chart: React.ReactNode;
  headerContent?: React.ReactNode;
  paddingHeaderContent?: boolean;
  className?: string;
  cardContentClassName?: string;
  showSeparator?: boolean;
}>;

export function ChartCard({
  title,
  description,
  chart,
  headerContent,
  className,
  cardContentClassName,
  paddingHeaderContent = false,
  showSeparator = true,
  children,
}: ChartCardProps) {
  return (
    <Card className={cn("pt-0", className)}>
      <CardHeader className={cn("flex flex-col items-stretch space-y-0 p-0 sm:flex-row [.border-b]:pb-0", { "border-b": showSeparator })}>
        <div className={cn("flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-5", { "!pb-0": paddingHeaderContent })}>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {children}
        {headerContent && (
          <div className="flex flex-col justify-center border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-6 sm:py-0">
            {headerContent}
          </div>
        )}
      </CardHeader>
      <CardContent className={cn("px-2 pt-4 sm:px-6 sm:pt-6", cardContentClassName)}>
        {chart}
      </CardContent>
    </Card>
  );
}

type ChartCardSkeletonProps = {
  title: string;
  description: string;
  headerContentSkeleton?: React.ReactNode;
  chartHeightClassName?: string;
  paddingHeaderContent?: boolean;
  showSeparator?: boolean;
  className?: string;
};

export function ChartCardSkeleton({
  title,
  description,
  headerContentSkeleton,
  paddingHeaderContent = false,
  chartHeightClassName = "aspect-[10/3]",
  showSeparator = true,
  className,
}: ChartCardSkeletonProps) {
  return (
    <Card className={cn("pt-0", className)}>
      <CardHeader className={cn("flex flex-col items-stretch space-y-0 p-0 sm:flex-row [.border-b]:pb-0", { "border-b": showSeparator })}>
        <div className={cn("flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-5", { "!pb-0": paddingHeaderContent })}>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {headerContentSkeleton && (
          <div className="flex flex-col justify-center border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-6 sm:py-0">
            {headerContentSkeleton}
          </div>
        )}
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className={cn("size-full pt-2", chartHeightClassName)}>
          <Skeleton className="size-full" />
        </div>
      </CardContent>
    </Card>
  );
}
