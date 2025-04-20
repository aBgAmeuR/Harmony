"use client";

import { ReusableAreaChart } from "@repo/ui/components/charts/area-chart";
import { ReusableBarChart } from "@repo/ui/components/charts/bar-chart";
import React from "react";
import {
	ChartCard,
	ChartCardContent,
	ChartCardHeader,
} from "~/components/charts/utils/chart-card";

type ArtistListeningTrendsProps = {
	stats: Promise<{
		monthlyTrends: Array<{
			month: string;
			msPlayed: number;
		}>;
		timeDistribution: Array<{
			hour: string;
			msPlayed: number;
		}>;
	} | null>;
};

export function ArtistListeningTrends({ stats }: ArtistListeningTrendsProps) {
	const chartData = React.use(stats);
	if (!chartData) return null;

	return (
		<div className="grid w-full gap-4 xl:grid-cols-2">
			<ChartCard>
				<ChartCardHeader
					showSeparator={true}
					title="Monthly Listening Activity"
					description="Total time listened in hours over the months"
				/>
				<ChartCardContent>
					<ReusableAreaChart
						data={chartData.monthlyTrends}
						className="aspect-video"
						areaDataKeys={["msPlayed"]}
						xAxisDataKey="month"
						showYAxis={false}
						config={{
							msPlayed: {
								label: "Time Played",
								color: "var(--chart-2)",
							},
						}}
					/>
				</ChartCardContent>
			</ChartCard>

			<ChartCard>
				<ChartCardHeader
					showSeparator={true}
					title="Listening Patterns"
					description="When you listen most during the day"
				/>
				<ChartCardContent>
					<ReusableBarChart
						data={chartData.timeDistribution}
						xAxisDataKey="hour"
						barDataKey="msPlayed"
						showYAxis={false}
						config={{
							msPlayed: {
								label: "Time Played",
								color: "var(--chart-1)",
							},
						}}
						tooltipLabelFormatter={(value) => `${value}h`}
						xAxisTickFormatter={(hour: string) => `${hour}h`}
						className="aspect-video"
					/>
				</ChartCardContent>
			</ChartCard>
		</div>
	);
}
