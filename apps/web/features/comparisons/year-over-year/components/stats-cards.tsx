import { Clock, Disc3, Music, TrendingDown, TrendingUp, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { cn } from "@repo/ui/lib/utils";
import { Skeleton } from "@repo/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui/tooltip";

import { msToHours } from "~/lib/utils";

import type { YearMetrics } from "../data/year-metrics";


type StatsCardsProps = {
    metrics1: YearMetrics
    metrics2: YearMetrics
};

const calculatePercentageChange = (current: number, previous: number): number => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
};

const formatPercentage = (percentage: number): string => {
    const sign = percentage >= 0 ? "+" : "";
    return `${sign}${percentage.toFixed(1)}%`;
};

export const StatsCards = ({ metrics1, metrics2 }: StatsCardsProps) => {
    const listeningTimeHours1 = msToHours(metrics1.totalListeningTime);
    const listeningTimeHours2 = msToHours(metrics2.totalListeningTime);
    const listeningTimeChange = calculatePercentageChange(listeningTimeHours1, listeningTimeHours2);

    const tracksChange = calculatePercentageChange(metrics1.uniqueTracks, metrics2.uniqueTracks);
    const artistsChange = calculatePercentageChange(metrics1.uniqueArtists, metrics2.uniqueArtists);
    const albumsChange = calculatePercentageChange(metrics1.uniqueAlbums, metrics2.uniqueAlbums);

    const statsData = [
        {
            title: "Listening Time",
            icon: Clock,
            value1: `${Math.round(listeningTimeHours1)}h`,
            value2: `${Math.round(listeningTimeHours2)}h`,
            change: listeningTimeChange,
        },
        {
            title: "Unique Tracks",
            icon: Music,
            value1: metrics1.uniqueTracks.toLocaleString(),
            value2: metrics2.uniqueTracks.toLocaleString(),
            change: tracksChange,
        },
        {
            title: "Unique Artists",
            icon: Users,
            value1: metrics1.uniqueArtists.toLocaleString(),
            value2: metrics2.uniqueArtists.toLocaleString(),
            change: artistsChange,
        },
        {
            title: "Unique Albums",
            icon: Disc3,
            value1: metrics1.uniqueAlbums.toLocaleString(),
            value2: metrics2.uniqueAlbums.toLocaleString(),
            change: albumsChange,
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statsData.map((stat) => {
                const isPositive = stat.change >= 0;
                const TrendIcon = isPositive ? TrendingUp : TrendingDown;

                return (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="font-medium text-sm">{stat.title}</CardTitle>
                            <stat.icon className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <div className="font-bold text-2xl">
                                    {stat.value1}
                                </div>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className={cn(
                                            "flex w-fit items-center gap-1 font-medium text-xs",
                                            isPositive ? "text-green-600" : "text-red-600"
                                        )}>
                                            <TrendIcon className="size-3" />
                                            {formatPercentage(stat.change)} vs {metrics2.year}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{metrics2.year}: {stat.value2}</p>
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

export const StatsCardsSkeleton = () => {
    const skeletonCards = [
        { title: "Listening Time", icon: Clock },
        { title: "Unique Tracks", icon: Music },
        { title: "Unique Artists", icon: Users },
        { title: "Unique Albums", icon: Disc3 },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {skeletonCards.map((card) => (
                <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">{card.title}</CardTitle>
                        <card.icon className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="font-bold text-2xl">
                            <Skeleton className="h-8 w-20" />
                        </div>
                        <div className="text-xs">
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
