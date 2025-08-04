'use client';

import { ComparisonLayout, ComparisonLayoutSkeleton } from "../../common/components/comparison-layout";
import { useYearsData } from '../hooks/use-years-data';

const labels = ["Listening Time", "Unique Artists", "Unique Tracks", "Unique Albums"];
const titles = { title1: "Top Artists", title2: "Top Tracks" };

export const ComparisonYearOverYearContent = () => (
    <ComparisonLayout hook={useYearsData} titles={titles} />
);

export const ComparisonYearOverYearContentSkeleton = () => (
    <ComparisonLayoutSkeleton labels={labels} titles={titles} />
);