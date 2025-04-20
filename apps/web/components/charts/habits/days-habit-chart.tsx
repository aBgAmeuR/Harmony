"use client";

import { ReusableBarChart } from "@repo/ui/components/charts/bar-chart";
import { Skeleton } from "@repo/ui/skeleton";
import * as React from "react";
import { getMsPlayedInHours } from "~/components/charts/utils/time-formatters";
import {
	ChartCard,
	ChartCardContent,
	ChartCardHeader,
} from "../utils/chart-card";

interface DaysHabitChartComponentProps {
	data: Promise<
		| {
				day: string;
				msPlayed: number;
		  }[]
		| null
	>;
}

export function DaysHabitChartComponent({
	data: dataPromise,
}: DaysHabitChartComponentProps) {
	const chartData = React.use(dataPromise);
	if (!chartData) return null;

	return (
		<ChartCard>
			<ChartCardHeader
				title="Listening by Day"
				description="When you listen most during the week"
			/>
			<ChartCardContent>
				<ReusableBarChart
					data={chartData}
					xAxisDataKey="day"
					barDataKey="msPlayed"
					config={{
						msPlayed: {
							label: "Time Played",
							color: "var(--chart-1)",
						},
					}}
					showYAxis={false}
					className="aspect-video"
					showBarLabels={true}
					barLabelFormatter={(value: number) => `${getMsPlayedInHours(value)}h`}
					yAxisTickFormatter={(value: number) =>
						`${getMsPlayedInHours(value)}h`
					}
					barRadius={8}
				/>
			</ChartCardContent>
		</ChartCard>
	);
}

export function DaysHabitChartSkeleton() {
	return (
		<ChartCard>
			<ChartCardHeader
				title="Listening by Day"
				description="When you listen most during the week"
			/>
			<ChartCardContent>
				<Skeleton className="aspect-video" />
			</ChartCardContent>
		</ChartCard>
	);
}
