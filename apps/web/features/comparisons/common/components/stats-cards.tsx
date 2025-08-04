import { Clock, Disc3, Music, TrendingDown, TrendingUp, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { cn } from "@repo/ui/lib/utils";
import { Skeleton } from "@repo/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/tooltip";

import type { ComparisonMetrics } from "../types";
import { calculatePercentageChange } from "../utils/calculations";

const ICONS = [Clock, Music, Users, Disc3]

const formatPercentage = (percentage: number): string => {
    const sign = percentage >= 0 ? "+" : "";
    return `${sign}${percentage.toFixed(1)}%`;
};

type ComparisonStatsCardsProps = {
    metrics1: ComparisonMetrics
    metrics2: ComparisonMetrics
}

export const ComparisonStatsCards = ({ metrics1, metrics2 }: ComparisonStatsCardsProps) => {
    const statsData = Object.entries(metrics1.cards).map(([key, value], index) => ({
        title: key,
        icon: ICONS[index],
        value1: metrics1.cards[key],
        value2: metrics2.cards[key],
        change: calculatePercentageChange(metrics2.cards[key], value),
    }));

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statsData.map((card) => {
                const isPositive = card.change >= 0;
                const TrendIcon = isPositive ? TrendingUp : TrendingDown;

                return (
                    <Card key={card.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="font-medium text-sm">{card.title}</CardTitle>
                            <card.icon className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="font-bold text-2xl">
                                    {card.value1}
                                </div>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className={cn(
                                            "flex w-fit items-center gap-1 font-medium text-xs",
                                            isPositive ? "text-green-600" : "text-red-600"
                                        )}>
                                            <TrendIcon className="size-3" />
                                            {formatPercentage(card.change)} vs {metrics2.label}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{metrics2.label}: {card.value2}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export const ComparisonStatsCardsSkeleton = ({ labels }: { labels: string[] }) => {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {labels.map((label, index) => {
                const Icon = ICONS[index];
                return (
                    <Card key={label}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="font-medium text-sm">{label}</CardTitle>
                            <Icon className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="font-bold text-2xl">
                                <Skeleton className="h-8 w-20" />
                            </div>
                            <div className="text-xs">
                                <Skeleton className="h-3 w-28" />
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    );
};
