"use client";

import { ComparisonLayout, ComparisonLayoutSkeleton } from "../../common/components/comparison-layout";
import { useArtistsData } from "../hooks/use-artists-data";

const labels = ["Listening Time", "Total Streams", "Unique Tracks", "Unique Albums"];
const titles = { title1: "Top Tracks", title2: "Top Albums" };

export const ComparisonArtistVsArtistContent = () => (
    <ComparisonLayout hook={useArtistsData} titles={titles} />
);

export const ComparisonArtistVsArtistContentSkeleton = () => (
    <ComparisonLayoutSkeleton labels={labels} titles={titles} />
);
