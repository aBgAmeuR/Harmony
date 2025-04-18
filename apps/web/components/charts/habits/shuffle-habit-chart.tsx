"use client";

import type { ChartConfig } from "@repo/ui/chart";
import * as React from "react";

import { ReusableRadialBarChart } from "@repo/ui/components/charts/radial-bar-chart";
import { Skeleton } from "@repo/ui/skeleton";
import {
	ChartCard,
	ChartCardContent,
	ChartCardHeader,
} from "../utils/chart-card";

interface ShuffleHabitChartComponentProps {
	data: Promise<{
		shuffled: number;
		notShuffled: number;
	} | null>;
}

export function ShuffleHabitChartComponent({
	data: dataPromise,
}: ShuffleHabitChartComponentProps) {
	const chartData = React.use(dataPromise);
	if (!chartData) return null;

	const totalTracks = chartData.shuffled + chartData.notShuffled;
	const shufflePercentage = Math.round(
		(chartData.shuffled / totalTracks) * 100,
	);

	const chartConfig = {
		shuffled: {
			label: "Shuffled",
			color: "var(--chart-1)",
		},
		notShuffled: {
			label: "Not Shuffled",
			color: "var(--chart-3)",
		},
	} as ChartConfig;

	return (
		<ChartCard>
			<ChartCardHeader
				title="Shuffled Mode"
				description="How often you use shuffle"
			/>
			<ChartCardContent>
				<div className="flex overflow-hidden w-full min-w-60 h-40 justify-center items-start">
					<ReusableRadialBarChart
						data={[chartData]}
						barDataKeys={["shuffled", "notShuffled"]}
						config={chartConfig}
						endAngle={180}
						innerRadius={80}
						outerRadius={130}
						percentage={shufflePercentage}
						centerLabel="Tracks Shuffled"
					/>
				</div>
			</ChartCardContent>
		</ChartCard>
	);
}

export function ShuffleHabitChartSkeleton() {
	return (
		<ChartCard>
			<ChartCardHeader
				title="Shuffled Mode"
				description="How often you use shuffle"
			/>
			<ChartCardContent>
				<Skeleton className="size-full h-[160px] w-[240px]" />
			</ChartCardContent>
		</ChartCard>
	);
}
