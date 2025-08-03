"use client";

import { useQuery } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";

import { getArtistMetricsAction } from "../actions/artist-metrics-action";

const useArtistMetrics = (artistId: string | null) => {
    return useQuery({
        queryKey: ["artistMetrics", artistId],
        queryFn: () => getArtistMetricsAction(artistId!),
        enabled: !!artistId,
    });
};

export function ComparisonContent() {
    const [artist1] = useQueryState("artist1", parseAsString);
    const [artist2] = useQueryState("artist2", parseAsString);

    const { data: metrics1 } = useArtistMetrics(artist1);
    const { data: metrics2 } = useArtistMetrics(artist2);

    return (
        <div className="grid grid-cols-2 gap-4">
            <pre>{JSON.stringify(metrics1, null, 2)}</pre>
            <pre>{JSON.stringify(metrics2, null, 2)}</pre>
        </div>
    );

    // const config: ComparisonConfig = {
    //     type: 'artist-vs-artist',
    //     label1: artist1Name,
    //     label2: artist2Name,
    //     chartTitle: 'Artist Comparison Overview',
    //     chartDescription: 'Compare listening metrics between artists',
    //     lineChartTitle: 'Monthly Evolution',
    //     lineChartDescription: 'Showing the evolution of listening time over months',
    // };

    // const topItemsComponent = metrics1 && metrics2 ? (
    //     <TopItemsCards
    //         metrics1={metrics1}
    //         metrics2={metrics2}
    //         artist1Name={artist1Name}
    //         artist2Name={artist2Name}
    //     />
    // ) : null;

    // return (
    //     <CommonComparisonContent
    //         metrics1={metrics1}
    //         metrics2={metrics2}
    //         config={config}
    //         isLoading={isLoading}
    //         hasError={hasError}
    //         hasSelection={!!artist1 && !!artist2}
    //         topItemsComponent={topItemsComponent}
    //     />
    // );
} 