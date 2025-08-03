'use client';

import { GroupedBarChart as CommonGroupedBarChart, GroupedBarChartSkeleton as CommonGroupedBarChartSkeleton } from "../../common/components/grouped-bar-chart";
import type { ArtistMetrics } from "../data/artist-metrics";

type GroupedBarChartProps = {
    metrics1: ArtistMetrics;
    metrics2: ArtistMetrics;
    artist1Name: string;
    artist2Name: string;
    className?: string;
};

function prepareData(metrics1: ArtistMetrics, metrics2: ArtistMetrics) {
    return [
        {
            metric: `Listening Time (minutes)`,
            value1: Math.round(metrics1.total.listeningTime / 60000),
            value2: Math.round(metrics2.total.listeningTime / 60000)
        },
        {
            metric: 'Total Streams',
            value1: metrics1.total.streams,
            value2: metrics2.total.streams
        },
        {
            metric: 'Unique Tracks',
            value1: metrics1.unique.tracks,
            value2: metrics2.unique.tracks
        },
        {
            metric: 'Unique Albums',
            value1: metrics1.unique.albums,
            value2: metrics2.unique.albums
        },
    ];
}

export function GroupedBarChart({ metrics1, metrics2, artist1Name, artist2Name, className }: GroupedBarChartProps) {
    const data = prepareData(metrics1, metrics2);

    return (
        <CommonGroupedBarChart
            data={data}
            label1={artist1Name}
            label2={artist2Name}
            title="Artist Comparison Overview"
            description="Compare listening metrics between artists"
            className={className}
        />
    );
}

export function GroupedBarChartSkeleton({ className }: { className?: string }) {
    return (
        <CommonGroupedBarChartSkeleton
            title="Artist Comparison Overview"
            description="Compare listening metrics between artists"
            className={className}
        />
    );
}