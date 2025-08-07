"use client";

import type { PropsWithChildren } from "react";

import { ComparisonLayout, ComparisonLayoutSkeleton } from "../../common/components/comparison-layout";
import { useArtistsData } from "../hooks/use-artists-data";

const labels = ["Listening Time", "Total Streams", "Unique Tracks", "Unique Albums"];
const titles = { title1: "Top Tracks", title2: "Top Albums" };


export const ComparisonArtistVsArtistContent = ({ children }: PropsWithChildren) => {
    const { metrics1, metrics2, isLoading, isError } = useArtistsData();

    if (!isLoading && (!metrics1 || !metrics2)) return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
            <h2 className="font-bold text-2xl text-foreground">Compare Your Artists</h2>
            <p className="max-w-md text-center text-muted-foreground">
                Select two artists from your top listened to compare their listening statistics, including play time, streams, and more.
            </p>
            {children}
        </div>
    );

    return (
        <ComparisonLayout
            metrics1={metrics1!}
            metrics2={metrics2!}
            isLoading={isLoading}
            isError={isError}
            titles={titles}
            labels={labels}
            lineChartTooltipValueFormatter="minuteSuffix"
            fillMissingMonths={true}
        />
    );
};

export const ComparisonArtistVsArtistContentSkeleton = () => (
    <ComparisonLayoutSkeleton labels={labels} titles={titles} />
);
