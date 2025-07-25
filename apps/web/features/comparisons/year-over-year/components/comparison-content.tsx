import { getUser } from "@repo/auth";

import { getYearMetrics, } from "../data/year-metrics";
import { GroupedBarChart } from "./grouped-bar-chart";
import { LineChartEvolution } from "./line-chart-evolution";
import { SideBySideTable } from "./side-by-side-table";
import { TopItemsCards } from "./top-items-cards";

type ComparisonContentProps = {
    year1: number;
    year2: number;
};

export async function ComparisonContent({ year1, year2 }: ComparisonContentProps) {
    const { userId } = await getUser();

    const [metrics1, metrics2] = await Promise.all([
        getYearMetrics(userId, year1),
        getYearMetrics(userId, year2),
    ]);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <SideBySideTable metrics1={metrics1} metrics2={metrics2} />
                <GroupedBarChart metrics1={metrics1} metrics2={metrics2} />
            </div>
            <LineChartEvolution metrics1={metrics1} metrics2={metrics2} />
            <TopItemsCards metrics1={metrics1} metrics2={metrics2} />
        </div>
    );
} 