'use client';

import { LineChartEvolution as CommonLineChartEvolution, LineChartEvolutionSkeleton as CommonLineChartEvolutionSkeleton } from "../../common/components/line-chart-evolution";
import type { ArtistMetrics } from "../data/artist-metrics";

type LineChartEvolutionProps = {
    metrics1: ArtistMetrics;
    metrics2: ArtistMetrics;
    artist1Name: string;
    artist2Name: string;
    className?: string;
};

export function LineChartEvolution({ metrics1, metrics2, artist1Name, artist2Name, className }: LineChartEvolutionProps) {
    // Create a map of all months from both artists
    const monthsMap = new Map<string, { value1: number; value2: number }>();

    // Add data from artist 1
    metrics1.monthly.forEach(m => {
        monthsMap.set(m.month, { value1: m.listeningTime, value2: 0 });
    });

    // Add data from artist 2
    metrics2.monthly.forEach(m => {
        const existing = monthsMap.get(m.month);
        if (existing) {
            existing.value2 = m.listeningTime;
        } else {
            monthsMap.set(m.month, { value1: 0, value2: m.listeningTime });
        }
    });

    // Convert to array and sort by month order
    const monthOrder = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const combinedData = Array.from(monthsMap.entries())
        .map(([month, data]) => ({
            month,
            value1: data.value1,
            value2: data.value2,
        }))
        .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

    const config = {
        value1: { label: artist1Name, color: "var(--chart-1)" },
        value2: { label: artist2Name, color: "var(--chart-4)" },
    };

    return (
        <CommonLineChartEvolution
            data={combinedData}
            xAxisDataKey="month"
            lineDataKeys={["value1", "value2"]}
            config={config}
            title="Monthly Evolution"
            description="Showing the evolution of listening time over months"
            className={className}
        />
    );
}

export function LineChartEvolutionSkeleton({ className }: { className?: string }) {
    return (
        <CommonLineChartEvolutionSkeleton
            title="Monthly Evolution"
            description="Showing the evolution of listening time over months"
            className={className}
        />
    );
}