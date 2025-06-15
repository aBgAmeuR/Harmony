import { Badge } from "@repo/ui/badge";
import { Card } from "@repo/ui/card";
import { NumberFlow, NumbersFlowDate } from "@repo/ui/components/number";
import { Progress } from "@repo/ui/progress";
import { Skeleton } from "@repo/ui/skeleton";
import { Calendar, Clock, FastForward, Users } from "lucide-react";

import { MusicItemCardContent } from "~/components/cards/music-item-card/content";
import { MusicItemCardImage } from "~/components/cards/music-item-card/image";
import { msToHours } from "~/lib/utils";
import { getNumbersStatsData } from "../data/numbers-stats";

type NumbersStatsCardsProps = {
    userId: string;
    isDemo: boolean;
    data?: Awaited<ReturnType<typeof getNumbersStatsData>>;
};

export const NumbersStatsCards = async ({ userId, isDemo, data }: NumbersStatsCardsProps) => {
    if (!data) {
        data = await getNumbersStatsData(userId, isDemo);
        if (!data) return null;
    }


    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Listening Time */}
            <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 text-white">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm opacity-75">Total Listening Time</p>
                        <h2 className="mt-2 font-bold text-4xl">
                            <NumberFlow
                                value={msToHours(data.listeningTime).toFixed(2)}
                                suffix=" hours"
                            />
                        </h2>
                    </div>
                    <Clock className="size-8 opacity-75" />
                </div>
                <p className="mt-1 text-sm opacity-75">
                    <NumberFlow
                        value={Math.round(msToHours(data.listeningTime) / 24)}
                        prefix="That's about "
                        suffix=" days of non-stop music!"
                    />
                </p>
            </Card>

            {/* Total Plays and Unique Tracks */}
            <Card className="p-6">
                <div className="mb-4 flex justify-between">
                    <div>
                        <p className="text-muted-foreground text-sm">Total Plays</p>
                        <h3 className="font-semibold text-2xl">
                            <NumberFlow
                                value={data.totalPlays}
                                format={{ notation: "standard" }}
                                locales="en-US"
                            />
                        </h3>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-sm">Unique Tracks</p>
                        <h3 className="font-semibold text-2xl">
                            <NumberFlow
                                value={data.uniqueTracks}
                                format={{ notation: "standard" }}
                                locales="en-US"
                            />
                        </h3>
                    </div>
                </div>
                <Progress
                    value={(data.uniqueTracks / data.totalPlays) * 100}
                    className="h-2 [&>div]:duration-500 [&>div]:ease-in-out"
                />
                <p className="mt-2 text-muted-foreground text-sm">
                    <NumberFlow
                        value={
                            data.uniqueTracks && data.totalPlays
                                ? data.uniqueTracks / data.totalPlays
                                : 0
                        }
                        format={{ style: "percent" }}
                        locales="en-US"
                        suffix=" of your plays were unique tracks"
                    />
                </p>
            </Card>

            {/* Different Artists */}
            <Card className="flex flex-row items-center space-x-4 p-6">
                <Users className="size-12 text-indigo-500" />
                <div>
                    <p className="text-muted-foreground text-sm">Different Artists</p>
                    <h3 className="font-bold text-3xl">
                        <NumberFlow
                            value={data.differentArtists}
                            format={{ notation: "standard" }}
                            locales="en-US"
                        />
                    </h3>
                    <p className="mt-1 text-muted-foreground text-sm">
                        Explored in your musical journey
                    </p>
                </div>
            </Card>

            {/* First Track */}
            <Card className="p-6">
                <h3 className="mb-2 font-semibold">First Track you played</h3>
                <div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <MusicItemCardImage
                            src={data.firstTrack.cover || undefined}
                            alt={data.firstTrack.name || undefined}
                        />
                        <MusicItemCardContent
                            item={{
                                href: data.firstTrack.href || "",
                                name: data.firstTrack.name || "",
                                artists: data.firstTrack.artists || undefined,
                            }}
                        />
                    </div>
                    <p className="mt-2 text-muted-foreground text-sm">
                        Played on{" "}
                        {data.firstTrack.timestamp ? (
                            <NumbersFlowDate
                                value={data.firstTrack.timestamp}
                                showTime={true}
                            />
                        ) : (
                            "an unknown date"
                        )}
                    </p>
                </div>
            </Card>

            {/* Most Played Day */}
            <Card className="bg-green-100 p-6 dark:bg-green-900">
                <Calendar className="mb-2 size-8 text-green-600 dark:text-green-400" />
                <h3 className="font-semibold">Most Active Day</h3>
                <p className="mt-1 font-bold text-2xl">
                    {data.mostActiveDay.day ? (
                        <NumbersFlowDate value={new Date(data.mostActiveDay.day)} />
                    ) : (
                        "No data available"
                    )}
                </p>
                <p className="mt-1 text-muted-foreground text-sm">
                    <NumberFlow
                        value={data.mostActiveDay.totalPlayed}
                        format={{ notation: "standard" }}
                        locales="en-US"
                        suffix=" tracks for "
                        prefix="You played "
                    />
                    <NumberFlow
                        value={msToHours(data.mostActiveDay.totalTime).toFixed(2)}
                        suffix=" hours"
                    />
                </p>
            </Card>

            {/* Online Track Percent */}
            <Card className="flex h-full flex-col justify-between p-6">
                <div className="mb-4 flex justify-between">
                    <div>
                        <p className="text-muted-foreground text-sm">Online Listening</p>
                        <h3 className="font-semibold text-4xl">
                            <NumberFlow
                                value={data.onlineTrackPercent / 100}
                                format={{ style: "percent" }}
                                locales="en-US"
                            />
                        </h3>
                    </div>
                </div>
                <Progress
                    value={data.onlineTrackPercent}
                    className="h-2 [&>div]:duration-500 [&>div]:ease-in-out"
                />
                <p className="mt-2 text-muted-foreground text-sm">
                    {data.onlineTrackPercent > 50
                        ? "You mostly listen to music while connected to the internet"
                        : "You mostly listen to music while offline"}
                </p>
            </Card>

            {/* Most Skipped Track */}
            <Card className="bg-red-100 p-6 dark:bg-red-900">
                <div className="mb-4 flex items-start justify-between">
                    <h3 className="font-semibold">Most Forwarded Track</h3>
                    <FastForward className="size-5 text-red-500 dark:text-red-400" />
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <MusicItemCardImage
                        src={data.mostFwdbtnTrack.cover || undefined}
                        alt={data.mostFwdbtnTrack.name || undefined}
                    />
                    <MusicItemCardContent
                        item={{
                            href: data.mostFwdbtnTrack.href || "",
                            name: data.mostFwdbtnTrack.name || "",
                            artists: data.mostFwdbtnTrack.artists || undefined,
                        }}
                    />
                </div>
                <Badge className="mt-3" variant="outline">
                    <NumberFlow
                        value={data.mostFwdbtnTrack.totalPlayed}
                        format={{ notation: "standard" }}
                        locales="en-US"
                        prefix="Forwarded "
                        suffix=" times"
                    />
                </Badge>
            </Card>
        </div>
    );
};

export const NumbersStatsCardsSkeleton = () => {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 text-white">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm opacity-75">Total Listening Time</p>
                        <Skeleton className="mt-4 h-10 w-40" />
                    </div>
                    <Clock className="size-8 opacity-75" />
                </div>
                <Skeleton className="mt-6 h-5 w-56" />
            </Card>

            <Card className="p-6">
                <div className="mb-4 flex justify-between">
                    <div>
                        <p className="text-muted-foreground text-sm">Total Plays</p>
                        <Skeleton className="mt-1 h-8 w-20" />
                    </div>
                    <div>
                        <p className="text-muted-foreground text-sm">Unique Tracks</p>
                        <Skeleton className="mt-1 h-8 w-20" />
                    </div>
                </div>
                <Progress className="h-2" />
                <Skeleton className="mt-2 h-5 w-44" />
            </Card>

            <Card className="flex items-center space-x-4 p-6">
                <Users className="size-12 text-indigo-500" />
                <div>
                    <p className="text-muted-foreground text-sm">Different Artists</p>
                    <Skeleton className="mt-2 h-7 w-20" />
                    <Skeleton className="mt-4 h-5 w-36" />
                </div>
            </Card>

            <Card className="p-6">
                <h3 className="mb-2 font-semibold">First Track of the Year</h3>
                <div>
                    <div className="flex items-center space-x-3">
                        <MusicItemCardImage />
                        <div className="space-y-1">
                            <Skeleton className="mt-1 h-5 w-32" />
                            <Skeleton className="mt-1 h-4 w-20" />
                        </div>
                    </div>
                    <Skeleton className="mt-2 h-4 w-36" />
                </div>
            </Card>

            <Card className="bg-green-100 p-6 dark:bg-green-900">
                <Calendar className="mb-2 size-8 text-green-600 dark:text-green-400" />
                <h3 className="font-semibold">Most Active Day</h3>
                <Skeleton className="mt-2 h-8 w-44" />
                <Skeleton className="mt-3 h-5 w-52" />
            </Card>

            <Card className="flex h-full flex-col justify-between p-6">
                <div className="mb-4 flex justify-between">
                    <div>
                        <p className="text-muted-foreground text-sm">Online Listening</p>
                        <Skeleton className="mt-3 h-10 w-24" />
                    </div>
                </div>
                <Progress className="h-2" />
                <Skeleton className="mt-1 h-5 w-64" />
            </Card>

            <Card className="bg-red-100 p-6 dark:bg-red-900">
                <div className="mb-4 flex items-start justify-between">
                    <h3 className="font-semibold">Most Forwarded Track</h3>
                    <FastForward className="size-5 text-red-500 dark:text-red-400" />
                </div>
                <div className="flex items-center space-x-3">
                    <MusicItemCardImage />
                    <div className="space-y-1">
                        <Skeleton className="mt-1 h-5 w-32" />
                        <Skeleton className="mt-1 h-4 w-20" />
                    </div>
                </div>
                <Skeleton className="mt-3 h-6 w-32" />
            </Card>
        </div>
    );
};
