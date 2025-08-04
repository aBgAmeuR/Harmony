'use client';

import { ComparisonLayout, ComparisonLayoutSkeleton } from "../../common/components/comparison-layout";
import { useYearsData } from '../hooks/use-years-data';

export const ComparisonYearOverYearContent = () => (
    <ComparisonLayout hook={useYearsData} titles={{ title1: "Top Artists", title2: "Top Tracks" }} />
);

export const ComparisonYearOverYearContentSkeleton = () => (
    <ComparisonLayoutSkeleton
        labels={["Listening Time", "Unique Artists", "Unique Tracks", "Unique Albums"]}
        titles={{ title1: "Top Artists", title2: "Top Tracks" }}
    />
);