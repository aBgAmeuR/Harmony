"use client";

import { ReusableAreaChart } from "@repo/ui/components/charts/area-chart";
import { ReusableBarChart } from "@repo/ui/components/charts/bar-chart";
import React from "react";
import {
	ChartCard,
	ChartCardContent,
	ChartCardHeader,
} from "~/components/charts/utils/chart-card";

interface AlbumListeningTrendsProps {
	data: Promise<{
		monthlyTrends: { month: string; msPlayed: number }[];
		timeDistribution: { hour: string; msPlayed: number }[];
		topDays: { date: string; msPlayed: number }[];
	}>;
}

export function AlbumListeningTrends({ data }: AlbumListeningTrendsProps) {
	const { monthlyTrends, timeDistribution, topDays } = React.use(data);

	return (
		<>
			<ChartCard>
				<ChartCardHeader
					title="Monthly Listening Trends"
					description="Your listening activity for this album over time"
					showSeparator={true}
				/>
				<ChartCardContent>
					<ReusableAreaChart
						data={monthlyTrends}
						showYAxis={false}
						xAxisDataKey="month"
						areaDataKeys={["msPlayed"]}
						config={{
							msPlayed: {
								label: "Time Played",
								color: "var(--chart-2)",
							},
						}}
					/>
				</ChartCardContent>
			</ChartCard>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<ChartCard>
					<ChartCardHeader
						title="Time of Day Distribution"
						description="When you typically listen to this album"
						showSeparator={true}
					/>
					<ChartCardContent>
						<ReusableBarChart
							data={timeDistribution}
							showYAxis={false}
							xAxisDataKey="hour"
							barDataKey="msPlayed"
							config={{
								msPlayed: {
									label: "Time Played",
									color: "var(--chart-1)",
								},
							}}
							tooltipLabelFormatter="hourSuffix"
							xAxisTickFormatter={(hour: string) => `${hour}h`}
						/>
					</ChartCardContent>
				</ChartCard>

				<ChartCard>
					<ChartCardHeader
						title="Top Listening Days"
						description="Your 10 most listened days for this album"
						showSeparator={true}
					/>
					<ChartCardContent>
						<ReusableBarChart
							data={topDays}
							showYAxis={false}
							xAxisDataKey="date"
							barDataKey="msPlayed"
							config={{
								msPlayed: { label: "Time Played", color: "var(--chart-2)" },
							}}
						/>
					</ChartCardContent>
				</ChartCard>
			</div>
		</>
	);
}
