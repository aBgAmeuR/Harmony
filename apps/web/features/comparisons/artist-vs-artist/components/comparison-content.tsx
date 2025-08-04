"use client";

import { ComparisonLayout, ComparisonLayoutSkeleton } from "../../common/components/comparison-layout";
import { useArtistsData } from "../hooks/use-artists-data";

export const ComparisonArtistVsArtistContent = () => (
    <ComparisonLayout hook={useArtistsData} titles={{ title1: "Top Tracks", title2: "Top Albums" }} />
);

export const ComparisonArtistVsArtistContentSkeleton = () => (
    <ComparisonLayoutSkeleton
        labels={["Listening Time", "Total Streams", "Unique Tracks", "Unique Albums"]}
        titles={{ title1: "Top Tracks", title2: "Top Albums" }}
    />
);
