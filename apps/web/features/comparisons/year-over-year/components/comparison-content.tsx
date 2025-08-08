'use client';

import { ComparisonLayout, ComparisonLayoutSkeleton } from "../../common/components/comparison-layout";
import { useYearsData } from '../hooks/use-years-data';

const labels = ["Listening Time", "Unique Artists", "Unique Tracks", "Unique Albums"];
const titles = { title1: "Top Artists", title2: "Top Tracks" };

export const ComparisonYearOverYearContent = () => {
    const { metrics1, metrics2, isLoading, isError } = useYearsData();

    return (
        <ComparisonLayout metrics1={metrics1} metrics2={metrics2} isLoading={isLoading} isError={isError} titles={titles} labels={labels} />
    );
};

export const ComparisonYearOverYearContentSkeleton = () => (
    <ComparisonLayoutSkeleton labels={labels} titles={titles} />
);