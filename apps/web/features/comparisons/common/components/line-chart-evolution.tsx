import type { ChartTooltipFormatter } from "@repo/ui/components/charts/common/chart-tooltip-formatter";
import { ReusableLineChart } from "@repo/ui/components/charts/line-chart";
import { Skeleton } from "@repo/ui/skeleton";

import { ChartCard, ChartCardContent, ChartCardHeader } from "~/components/charts/utils/chart-card";
import { DateUtils } from "~/lib/date-utils";

import type { ComparisonMetrics } from "../types";

type ComparisonLineChartEvolutionProps = {
    metrics1: ComparisonMetrics
    metrics2: ComparisonMetrics
    className?: string;
    tooltipValueFormatter?: ChartTooltipFormatter;
    fillMissingMonths?: boolean;
};

const getMonthData = (monthly1: ComparisonMetrics['monthly'], monthly2: ComparisonMetrics['monthly'], fillMissingMonths: boolean) => {
    if (!fillMissingMonths) return monthly1.map((m1, index) => ({
        month: m1.month,
        value1: m1.listeningTime,
        value2: monthly2[index]?.listeningTime ?? 0,
    }));

    const map1 = new Map(monthly1.map(m => [m.month, m.listeningTime]));
    const map2 = new Map(monthly2.map(m => [m.month, m.listeningTime]));

    const allMonthStrings = new Set([...map1.keys(), ...map2.keys()]);
    if (allMonthStrings.size === 0) return [];

    const monthData = Array.from(allMonthStrings).map(monthStr => {
        const { monthIndex, year } = DateUtils.getMonthIndex(monthStr);
        return { monthStr, monthIndex, year };
    }).filter(({ monthIndex }) => monthIndex !== -1);

    if (monthData.length === 0) return [];

    const minMonth = monthData.reduce((min, curr) =>
        curr.year < min.year || (curr.year === min.year && curr.monthIndex < min.monthIndex) ? curr : min
    );
    const maxMonth = monthData.reduce((max, curr) =>
        curr.year > max.year || (curr.year === max.year && curr.monthIndex > max.monthIndex) ? curr : max
    );

    const allMonths = DateUtils.generateMonthRange(
        { monthIndex: minMonth.monthIndex, year: minMonth.year },
        { monthIndex: maxMonth.monthIndex, year: maxMonth.year }
    );

    return allMonths.map(monthStr => ({
        month: monthStr,
        value1: map1.get(monthStr) ?? null,
        value2: map2.get(monthStr) ?? null,
    }));
}

export function ComparisonLineChartEvolution({
    metrics1,
    metrics2,
    className,
    tooltipValueFormatter = "hourSuffix",
    fillMissingMonths = false
}: ComparisonLineChartEvolutionProps) {
    const data = getMonthData(metrics1.monthly, metrics2.monthly, fillMissingMonths);

    const config = {
        value1: { label: metrics1.label, color: "var(--chart-1)" },
        value2: { label: metrics2.label, color: "var(--chart-4)" },
    };

    return (
        <ChartCard className={className}>
            <ChartCardHeader
                title="Monthly Evolution"
                description="Showing the evolution of listening time over time"
                showSeparator={true}
            />
            <ChartCardContent>
                <ReusableLineChart
                    data={data}
                    className="aspect-[4/1]"
                    xAxisDataKey="month"
                    lineDataKeys={["value1", "value2"]}
                    config={config}
                    showYAxis={false}
                    tooltipValueFormatter={tooltipValueFormatter}
                    showDots={true}
                    margin={{ left: 6, top: 6, right: 6, bottom: 0 }}
                />
            </ChartCardContent>
        </ChartCard>
    );
}

export function ComparisonLineChartEvolutionSkeleton({ className }: { className?: string }) {
    return (
        <ChartCard className={className}>
            <ChartCardHeader
                title="Monthly Evolution"
                description="Showing the evolution of listening time over time"
                showSeparator={true}
            />
            <ChartCardContent>
                <div className="flex aspect-[4/1] items-center justify-center">
                    <Skeleton className="size-full" />
                </div>
            </ChartCardContent>
        </ChartCard>
    );
}