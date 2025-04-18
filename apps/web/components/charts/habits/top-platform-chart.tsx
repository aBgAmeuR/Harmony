"use client";

import * as React from "react";

import { ReusablePieChart } from "@repo/ui/components/charts/pie-chart";
import { Skeleton } from "@repo/ui/skeleton";
import { getMsPlayedInHours } from "~/components/charts/utils/time-formatters";
import {
	ChartCard,
	ChartCardContent,
	ChartCardHeader,
} from "../utils/chart-card";

interface TopPlatformChartComponentProps {
	data: Promise<
		| {
				platform: string;
				msPlayed: number;
		  }[]
		| null
	>;
}

export function TopPlatformChartComponent({
	data: dataPromise,
}: TopPlatformChartComponentProps) {
	const chartData = React.use(dataPromise);
	if (!chartData) return null;

	const totalListeningTime = chartData.reduce(
		(total, { msPlayed }) => total + msPlayed,
		0,
	);

	return (
		<ChartCard>
			<ChartCardHeader
				title="Top Platforms"
				description="Most used platforms"
			/>
			<ChartCardContent>
				<ReusablePieChart
					data={chartData}
					valueDataKey="msPlayed"
					nameKey="platform"
					centerLabel="Hours listened"
					centerValue={`${getMsPlayedInHours(totalListeningTime, false)}h`}
					tooltipLabelFormatter={(_, payload) =>
						`${payload[0].payload.platform.charAt(0).toUpperCase()}${payload[0].payload.platform.slice(1)}`
					}
				/>
			</ChartCardContent>
		</ChartCard>
	);
}

export function TopPlatformChartSkeleton() {
	return (
		<ChartCard>
			<ChartCardHeader
				title="Top Platforms"
				description="Most used platforms"
			/>
			<ChartCardContent>
				<Skeleton className="size-full h-[240px] w-[240px]" />
			</ChartCardContent>
		</ChartCard>
	);
}
