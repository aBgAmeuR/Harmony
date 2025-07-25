import { getUser } from "@repo/auth";

import { getYearMetrics, } from "../data/year-metrics";
import { calculatePercentageChange } from "../utils/calculations";
import { GroupedBarChart } from "./grouped-bar-chart";
import { LineChartEvolution } from "./line-chart-evolution";
import { SideBySideTable } from "./side-by-side-table";
import { TopItemsCards } from "./top-items-cards";

type ComparisonContentProps = {
    year1: number | null;
    year2: number | null;
};

export async function ComparisonContent({ year1, year2 }: ComparisonContentProps) {
    const { userId } = await getUser();
    const _year1 = year1 ?? new Date().getFullYear();
    const _year2 = year2 ?? _year1 - 1;

    const [metrics1, metrics2] = await Promise.all([
        getYearMetrics(userId, _year1),
        getYearMetrics(userId, _year2),
    ]);

    const _listeningChange = calculatePercentageChange(metrics1.totalListeningTime, metrics2.totalListeningTime);
    const _streamsChange = calculatePercentageChange(metrics1.numStreams, metrics2.numStreams);

    // Add more computations as needed

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <SideBySideTable metrics1={metrics1} metrics2={metrics2} />
                <GroupedBarChart metrics1={metrics1} metrics2={metrics2} />
            </div>
            <LineChartEvolution metrics1={metrics1} metrics2={metrics2} />
            <TopItemsCards metrics1={metrics1} metrics2={metrics2} />
            {/* Summary card, etc. */}
        </div>
    );
} 