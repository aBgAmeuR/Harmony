"use client";

import { ComparisonLayout, ComparisonLayoutSkeleton } from "../../common/components/comparison-layout";
import { useArtistsData } from "../hooks/use-artists-data";

const labels = ["Listening Time", "Total Streams", "Unique Tracks", "Unique Albums"];
const titles = { title1: "Top Tracks", title2: "Top Albums" };

export const ComparisonArtistVsArtistContent = () => {
    const { metrics1, metrics2, isLoading, isError } = useArtistsData();

    return (
        <ComparisonLayout metrics1={metrics1} metrics2={metrics2} isLoading={isLoading} isError={isError} titles={titles} labels={labels} />
    );
};

export const ComparisonArtistVsArtistContentSkeleton = () => (
    <ComparisonLayoutSkeleton labels={labels} titles={titles} />
);
