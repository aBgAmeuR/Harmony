"use client";

import { ReusableLineChart } from "@repo/ui/components/charts/line-chart";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface HistoricalRankingsChartProps {
	data: Array<{
		timestamp: Date;
		rank: number;
	}>;
	className?: string;
}

export function HistoricalRankingsChart({
	data,
	className,
}: HistoricalRankingsChartProps) {
	const chartData = data.map((item) => ({
		date: format(item.timestamp, "dd MMM", { locale: fr }),
		rank: item.rank,
	}));

	return (
		<ReusableLineChart
			data={chartData}
			xAxisDataKey="date"
			lineDataKey="rank"
			config={{
				rank: {
					label: "Rank",
					color: "var(--chart-1)",
				},
			}}
			yAxisReversed={true}
			yAxisDomain={[1, 50]}
			className={className}
		/>
	);
}
