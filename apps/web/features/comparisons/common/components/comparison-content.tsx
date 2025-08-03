"use client";

import { AlertCircle, Clock, Disc3, Music, Users } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";

import type { ComparisonConfig, ComparisonMetrics } from "../types";
import { GroupedBarChart, GroupedBarChartSkeleton } from "./grouped-bar-chart";
import { LineChartEvolution, LineChartEvolutionSkeleton } from "./line-chart-evolution";

interface ComparisonContentProps {
    metrics1: ComparisonMetrics | undefined;
    metrics2: ComparisonMetrics | undefined;
    config: ComparisonConfig;
    isLoading: boolean;
    hasError: boolean;
    hasSelection: boolean;
    topItemsComponent?: React.ReactNode;
}

export function ComparisonContent({
    metrics1,
    metrics2,
    config,
    isLoading,
    hasError,
    hasSelection,
    topItemsComponent,
}: ComparisonContentProps) {
    if (!hasSelection) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Selection Required</AlertTitle>
                <AlertDescription>
                    {config.type === 'year-over-year'
                        ? "Please select exactly two years to proceed with the comparison."
                        : "Please select exactly two artists to proceed with the comparison."
                    }
                </AlertDescription>
            </Alert>
        );
    }

    if (isLoading) {
        return <ComparisonContentSkeleton config={config} topItemsComponent={topItemsComponent} />;
    }

    if (hasError) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Data</AlertTitle>
                <AlertDescription>
                    There was an error loading the comparison data. Please try again.
                </AlertDescription>
            </Alert>
        );
    }

    // Check if either item has no data
    const hasNoData1 = metrics1?.total.streams === 0;
    const hasNoData2 = metrics2?.total.streams === 0;

    if (hasNoData1 || hasNoData2) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Data Available</AlertTitle>
                <AlertDescription>
                    {hasNoData1 && hasNoData2
                        ? `No listening data found for either ${config.type === 'year-over-year' ? 'year' : 'artist'} in your selected time range.`
                        : hasNoData1
                            ? `No listening data found for the first selected ${config.type === 'year-over-year' ? 'year' : 'artist'} in your time range.`
                            : `No listening data found for the second selected ${config.type === 'year-over-year' ? 'year' : 'artist'} in your time range.`
                    }
                </AlertDescription>
            </Alert>
        );
    }

    if (!metrics1 || !metrics2) return null;

    // Prepare stats data
    const statsData = prepareStatsData(metrics1, metrics2, config);

    // Prepare chart data
    const barChartData = prepareBarChartData(metrics1, metrics2, config);
    const lineChartData = prepareLineChartData(metrics1, metrics2, config);

    return (
        <div className="space-y-6">
            <StatsCards
                statsData={statsData}
                label1={config.label1}
                label2={config.label2}
            />

            <div className="grid gap-6 lg:grid-cols-2">
                <GroupedBarChart
                    data={barChartData}
                    label1={config.label1}
                    label2={config.label2}
                    title={config.chartTitle}
                    description={config.chartDescription}
                />
                <LineChartEvolution
                    data={lineChartData.data}
                    xAxisDataKey={lineChartData.xAxisDataKey}
                    lineDataKeys={lineChartData.lineDataKeys}
                    config={lineChartData.config}
                    title={config.lineChartTitle}
                    description={config.lineChartDescription}
                />
            </div>

            {topItemsComponent && topItemsComponent}
        </div>
    );
}

export function ComparisonContentSkeleton({
    config,
    topItemsComponent
}: {
    config: ComparisonConfig;
    topItemsComponent?: React.ReactNode;
}) {
    return (
        <div className="space-y-6">
            <StatsCardsSkeleton />

            <div className="grid gap-6 lg:grid-cols-2">
                <GroupedBarChartSkeleton
                    title={config.chartTitle}
                    description={config.chartDescription}
                />
                <LineChartEvolutionSkeleton
                    title={config.lineChartTitle}
                    description={config.lineChartDescription}
                />
            </div>

            {topItemsComponent && topItemsComponent}
        </div>
    );
}

// Helper functions
function prepareStatsData(metrics1: ComparisonMetrics, metrics2: ComparisonMetrics, config: ComparisonConfig) {

    const listeningTime1 = msToHours(metrics1.totalListeningTime || metrics1.total.listeningTime);
    const listeningTime2 = msToHours(metrics2.totalListeningTime || metrics2.total.listeningTime);
    const listeningTimeChange = calculatePercentageChange(listeningTime1, listeningTime2);

    const streams1 = metrics1.numStreams || metrics1.total.streams;
    const streams2 = metrics2.numStreams || metrics2.total.streams;
    const streamsChange = calculatePercentageChange(streams1, streams2);

    const tracks1 = metrics1.uniqueTracks || metrics1.unique.tracks;
    const tracks2 = metrics2.uniqueTracks || metrics2.unique.tracks;
    const tracksChange = calculatePercentageChange(tracks1, tracks2);

    const albums1 = metrics1.uniqueAlbums || metrics1.unique.albums;
    const albums2 = metrics2.uniqueAlbums || metrics2.unique.albums;
    const albumsChange = calculatePercentageChange(albums1, albums2);

    const statsData = [
        {
            title: "Listening Time",
            icon: Clock,
            value1: `${Math.round(listeningTime1)}h`,
            value2: `${Math.round(listeningTime2)}h`,
            change: listeningTimeChange,
        },
        {
            title: config.type === 'year-over-year' ? "Total Streams" : "Total Streams",
            icon: Music,
            value1: streams1.toLocaleString(),
            value2: streams2.toLocaleString(),
            change: streamsChange,
        },
        {
            title: "Unique Tracks",
            icon: config.type === 'year-over-year' ? Music : Users,
            value1: tracks1.toLocaleString(),
            value2: tracks2.toLocaleString(),
            change: tracksChange,
        },
        {
            title: "Unique Albums",
            icon: Disc3,
            value1: albums1.toLocaleString(),
            value2: albums2.toLocaleString(),
            change: albumsChange,
        },
    ];

    // Add unique artists for year-over-year
    if (config.type === 'year-over-year' && metrics1.uniqueArtists && metrics2.uniqueArtists) {
        const artistsChange = calculatePercentageChange(metrics1.uniqueArtists, metrics2.uniqueArtists);
        statsData[2] = {
            title: "Unique Artists",
            icon: Users,
            value1: metrics1.uniqueArtists.toLocaleString(),
            value2: metrics2.uniqueArtists.toLocaleString(),
            change: artistsChange,
        };
    }

    return statsData;
}

function prepareBarChartData(metrics1: ComparisonMetrics, metrics2: ComparisonMetrics, config: ComparisonConfig) {
    const data = [
        {
            metric: "Listening Time (minutes)",
            value1: Math.round((metrics1.totalListeningTime || metrics1.total.listeningTime) / 60000),
            value2: Math.round((metrics2.totalListeningTime || metrics2.total.listeningTime) / 60000),
        },
        {
            metric: "Total Streams",
            value1: metrics1.numStreams || metrics1.total.streams,
            value2: metrics2.numStreams || metrics2.total.streams,
        },
    ];

    if (config.type === 'artist-vs-artist') {
        data.push(
            {
                metric: "Unique Tracks",
                value1: metrics1.unique.tracks,
                value2: metrics2.unique.tracks,
            },
            {
                metric: "Unique Albums",
                value1: metrics1.unique.albums,
                value2: metrics2.unique.albums,
            }
        );
    }

    return data;
}

function prepareLineChartData(metrics1: ComparisonMetrics, metrics2: ComparisonMetrics, config: ComparisonConfig) {
    // Create a map of all months from both datasets
    const monthsMap = new Map<string, { value1: number; value2: number }>();

    // Add data from first dataset
    metrics1.monthly.forEach(m => {
        monthsMap.set(m.month, { value1: m.listeningTime, value2: 0 });
    });

    // Add data from second dataset
    metrics2.monthly.forEach(m => {
        const existing = monthsMap.get(m.month);
        if (existing) {
            existing.value2 = m.listeningTime;
        } else {
            monthsMap.set(m.month, { value1: 0, value2: m.listeningTime });
        }
    });

    // Convert to array and sort by month order
    const monthOrder = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const combinedData = Array.from(monthsMap.entries())
        .map(([month, data]) => ({
            month,
            value1: data.value1,
            value2: data.value2,
        }))
        .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

    const chartConfig = {
        value1: { label: config.label1, color: "var(--chart-1)" },
        value2: { label: config.label2, color: "var(--chart-4)" },
    };

    return {
        data: combinedData,
        xAxisDataKey: "month",
        lineDataKeys: ["value1", "value2"],
        config: chartConfig,
    };
}