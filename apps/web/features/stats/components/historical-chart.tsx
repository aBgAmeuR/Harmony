"use client";

import { ReusableLineChart } from "@repo/ui/components/charts/line-chart";

interface HistoricalChartProps {
	data: Array<{
		timestamp: string;
		rank: number | null;
	}>;
}

export function HistoricalChart({ data }: HistoricalChartProps) {
	const chartData = data.map((item) => ({
		date: item.timestamp,
		rank: item.rank,
	}));

	return (
		<ReusableLineChart
			data={chartData}
			xAxisDataKey="date"
			lineDataKeys={["rank"]}
			config={{ rank: { label: "Rank", color: "var(--chart-1)" } }}
			yAxisReversed={true}
			yAxisDomain={[1, 50]}
			showDots={true}
			className="aspect-video"
		/>
	);
}
