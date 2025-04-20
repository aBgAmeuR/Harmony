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

interface SkippedHabitChartComponentProps {
	data: Promise<{
		skipped: number;
		notSkipped: number;
	} | null>;
}

export function SkippedHabitChartComponent({
	data: dataPromise,
}: SkippedHabitChartComponentProps) {
	const chartData = React.use(dataPromise);
	if (!chartData) return null;

	const totalTracks = chartData.skipped + chartData.notSkipped;
	const skippedPercentage = Math.round((chartData.skipped / totalTracks) * 100);

	const chartConfig = {
		skipped: {
			label: "Skipped",
			color: "var(--chart-3)",
		},
		notSkipped: {
			label: "Not Skipped",
			color: "var(--chart-1)",
		},
	} as ChartConfig;

	return (
		<ChartCard>
			<ChartCardHeader
				title="Skipped Tracks"
				description="How often you skip tracks"
			/>
			<ChartCardContent>
				<div className="flex h-40 w-full min-w-60 items-start justify-center overflow-hidden">
					<ReusableRadialBarChart
						data={[chartData]}
						barDataKeys={["skipped", "notSkipped"]}
						config={chartConfig}
						endAngle={180}
						innerRadius={80}
						outerRadius={130}
						percentage={skippedPercentage}
						centerLabel="Tracks Skipped"
					/>
				</div>
			</ChartCardContent>
		</ChartCard>
	);
}

export function SkippedHabitChartSkeleton() {
	return (
		<ChartCard>
			<ChartCardHeader
				title="Skipped Tracks"
				description="How often you skip tracks"
			/>
			<ChartCardContent>
				<Skeleton className="size-full h-[160px] w-[240px]" />
			</ChartCardContent>
		</ChartCard>
	);
}
