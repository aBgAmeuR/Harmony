'use client';

import { useQuery } from "@tanstack/react-query";
import { parseAsInteger, useQueryState } from "nuqs";

import { getYearMetrics, } from "../data/year-metrics";
import { GroupedBarChart } from "./grouped-bar-chart";
import { LineChartEvolution } from "./line-chart-evolution";
import { SideBySideTable } from "./side-by-side-table";
import { TopItemsCards } from "./top-items-cards";
import { getYearMetricsAction } from "../actions/year-metrics-action";
import { StatsCards } from "./stats-cards";

const useYearMetrics = (year1: number, year2: number) => {
    const metrics1Query = useQuery({
        queryKey: ["yearMetrics", year1],
        queryFn: () => getYearMetricsAction(year1),
        enabled: !!year1,
    });
    const metrics2Query = useQuery({
        queryKey: ["yearMetrics", year2],
        queryFn: () => getYearMetricsAction(year2),
        enabled: !!year2,
    });

    return {
        metrics1: metrics1Query.data,
        metrics2: metrics2Query.data,
        isLoading: metrics1Query.isLoading || metrics2Query.isLoading,
        isError: metrics1Query.isError || metrics2Query.isError,
    };
};

export function ComparisonContent() {
    const [year1] = useQueryState('year1', parseAsInteger.withDefault(new Date().getFullYear()));
    const [year2] = useQueryState('year2', parseAsInteger.withDefault(new Date().getFullYear() - 1));
    const { metrics1, metrics2, isLoading, isError } = useYearMetrics(year1, year2);

    if (isLoading) return <div>Loading...</div>;
    if (!metrics1 || !metrics2 || isError) return <div>Error loading metrics</div>;

    return (
        <div className="space-y-4">
            <StatsCards metrics1={metrics1} metrics2={metrics2} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <SideBySideTable metrics1={metrics1} metrics2={metrics2} />
                <GroupedBarChart metrics1={metrics1} metrics2={metrics2} />
            </div>
            <LineChartEvolution metrics1={metrics1} metrics2={metrics2} />
            <TopItemsCards metrics1={metrics1} metrics2={metrics2} />
        </div>
    );
} 