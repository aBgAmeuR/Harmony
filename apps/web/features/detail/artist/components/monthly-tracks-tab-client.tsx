'use client'

import React from "react";
import { Music4Icon } from "lucide-react";

import { Separator } from "@repo/ui/separator";

import { MusicItemCard } from "~/components/cards/music-item-card";
import { TrackRaceChartComponent } from "~/components/charts/artist/track-race-chart";
import { ChartCard, ChartCardContent, ChartCardHeader, ChartCardHeaderContent } from "~/components/charts/utils/chart-card";
import { TrendBadge } from "~/components/trend-badge";
import { DateUtils } from "~/lib/date-utils";

import type { ChartRace, MonthlyTrends } from "../data/monthly-tracks-tab";
import { MonthSelector } from "./month-selector";

type MonthlyTracksTabClientProps = {
    monthlyTrends: MonthlyTrends[];
    chartRace: ChartRace[];
}

export const MonthlyTracksTabClient = ({ monthlyTrends, chartRace }: MonthlyTracksTabClientProps) => {
    const [date, setDate] = React.useState<Date>(new Date(`${monthlyTrends[0].month}-01`));
    const artistName = 'artistName'

    const { month, tracks } =
        monthlyTrends.find((month) => month.month === DateUtils.formatDate(date, "month-year")) || monthlyTrends[0];

    return (
        <div className="space-y-6">
            <ChartCard className="pb-0">
                <ChartCardHeader
                    title={`Top Tracks for ${month}`}
                    description={`Your most played tracks by ${artistName || "this artist"} during ${month}.`}
                    showSeparator={true}
                >
                    <ChartCardHeaderContent className="border-l-transparent">
                        <MonthSelector
                            date={date}
                            setDate={setDate}
                            minDate={new Date(`${monthlyTrends[monthlyTrends.length - 1].month}-01`)}
                            maxDate={new Date(`${monthlyTrends[0].month}-01`)}
                        />
                    </ChartCardHeaderContent>
                </ChartCardHeader>
                <ChartCardContent className="!p-0">
                    {tracks.length > 0 ? (
                        tracks.map((track, index) => (
                            <div key={track.id} className="flex flex-col">
                                <MusicItemCard
                                    item={{
                                        ...track,
                                        description: (
                                            <TrendBadge
                                                trend={track.trend}
                                                previousRank={track.previousRank}
                                            />
                                        ),
                                    }}
                                    rank={index + 1}
                                    className="pr-4"
                                />
                                {index < tracks.length - 1 && <Separator />}
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                            <Music4Icon className="mb-2 size-8" />
                            <p>
                                No tracks played for {artistName || "this artist"} during{" "}
                                {month}.
                            </p>
                        </div>
                    )}
                </ChartCardContent>
            </ChartCard>
            <TrackRaceChartComponent
                data={{
                    series: chartRace,
                    artistName,
                }}
                availableYears={Array.from(
                    new Set(monthlyTrends.map((d) => new Date(`${d.month}-01`).getFullYear())),
                ).sort((a, b) => b - a)}
                initialYear={new Date(`${monthlyTrends[0].month}-01`).getFullYear()}
                className="mt-6"
            />
        </div>
    );
};