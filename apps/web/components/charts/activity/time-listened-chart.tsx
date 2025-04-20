"use client";

import { ReusableBarChart } from "@repo/ui/components/charts/bar-chart";
import { ChartTooltipFormatter } from "@repo/ui/components/charts/chart-tooltip-formatter";
import { NumberFlow } from "@repo/ui/components/number";
import { Skeleton } from "@repo/ui/skeleton";
import * as React from "react";
import {
	ChartCard,
	ChartCardContent,
	ChartCardHeader,
	ChartCardHeaderContent,
} from "../utils/chart-card";
import { msToHours } from "../utils/time-formatters";

interface TimeListenedChartComponentProps {
	data: Promise<{
		data: Array<{ month: string; value: number }>;
		average: number;
	} | null>;
	className?: string;
}

export function TimeListenedChartComponent({
	data: dataPromise,
	className,
}: TimeListenedChartComponentProps) {
	const chartData = React.use(dataPromise);
	if (!chartData) return null;

	// Custom tooltip label formatter that shows percentage difference from average
	const labelFormatter = (value: string, payload: any, average: number) => {
		const percentage = ((payload[0].value - average) / average) * 100;

		return (
			<div className="flex w-full items-center justify-between gap-2">
				<p>{value}</p>
				{percentage >= 0 ? (
					<NumberFlow
						value={Math.abs(percentage).toFixed(2)}
						prefix="+"
						suffix="%"
						className="font-medium text-emerald-700 dark:text-emerald-500"
					/>
				) : (
					<NumberFlow
						value={Math.abs(percentage).toFixed(2)}
						prefix="-"
						suffix="%"
						className="font-medium text-red-700 dark:text-red-500"
					/>
				)}
			</div>
		);
	};

	const headerDescription = (
		<NumberFlow
			value={msToHours(chartData.average).toFixed(2)}
			suffix=" hours"
		/>
	);

	return (
		<ChartCard className={className}>
			<ChartCardHeader
				showSeparator={true}
				title="Time Listened Over Months"
				description="Showing total time listened in hours over the months"
			>
				<ChartCardHeaderContent
					title="Average time listened"
					description={headerDescription}
				/>
			</ChartCardHeader>
			<ChartCardContent>
				<ReusableBarChart
					data={chartData.data}
					xAxisDataKey="month"
					barDataKey="value"
					referenceLine={{
						value: chartData.average,
						label: "Average",
					}}
					showYAxis={false}
					tooltipLabelFormatter={(value, payload) =>
						labelFormatter(value, payload, chartData.average)
					}
					tooltipValueFormatter={ChartTooltipFormatter}
					yAxisTickFormatter={(value) => `${msToHours(value).toFixed(0)}h`}
					className="aspect-[10/3] w-full"
				/>
			</ChartCardContent>
		</ChartCard>
	);
}

export function TimeListenedChartSkeleton({
	className,
}: { className?: string }) {
	return (
		<ChartCard className={className}>
			<ChartCardHeader
				showSeparator={true}
				title="Time Listened Over Months"
				description="Showing total time listened in hours over the months"
			>
				<ChartCardHeaderContent
					title="Average time listened"
					description={<Skeleton className="mt-2 py-px">00,00 hours</Skeleton>}
				/>
			</ChartCardHeader>
			<ChartCardContent>
				<Skeleton className="aspect-[10/3]" />
			</ChartCardContent>
		</ChartCard>
	);
}
