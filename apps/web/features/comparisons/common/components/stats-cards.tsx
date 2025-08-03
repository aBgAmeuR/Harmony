import { TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { cn } from "@repo/ui/lib/utils";
import { Skeleton } from "@repo/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/tooltip";

type ComparisonStatsCardsProps = {
    cards: Array<{
        title: string;
        icon: React.ElementType;
        value1: string;
        value2: string;
        change: number;
    }>;
    label: string;
};

const formatPercentage = (percentage: number): string => {
    const sign = percentage >= 0 ? "+" : "";
    return `${sign}${percentage.toFixed(1)}%`;
};

export const ComparisonStatsCards = ({ cards, label }: ComparisonStatsCardsProps) => {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => {
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
                                            {formatPercentage(card.change)} vs {label}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{label}: {card.value2}</p>
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

type ComparisonStatsCardsSkeletonProps = {
    cards: Array<{
        title: string;
        icon: React.ElementType;
    }>;
};

export const ComparisonStatsCardsSkeleton = ({ cards }: ComparisonStatsCardsSkeletonProps) => {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
                <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">{card.title}</CardTitle>
                        <card.icon className="size-4 text-muted-foreground" />
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
            ))}
        </div>
    );
};
