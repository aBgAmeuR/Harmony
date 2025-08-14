import { getUser } from "@repo/auth";
import type { ChartConfig } from "@repo/ui/chart";
import { ReusableRadialBarChart } from "@repo/ui/components/charts/radial-bar-chart";
import { Skeleton } from "@repo/ui/skeleton";

import {
	ChartCard,
	ChartCardContent,
	ChartCardHeader,
} from "~/components/charts/utils/chart-card";

import { getSkippedHabitsData } from "../data/skipped-habits";

type SkippedHabitsChartComponentProps = {
	data?: Awaited<ReturnType<typeof getSkippedHabitsData>>;
};

export const SkippedHabitsChart = async ({ data }: SkippedHabitsChartComponentProps) => {
	const { userId, isDemo } = await getUser();

	if (!data) {
		data = await getSkippedHabitsData(userId, isDemo);
		if (!data) return null;
	}

	const totalTracks = data.skipped + data.notSkipped;
	const skippedPercentage = Math.round((data.skipped / totalTracks) * 100);

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
			<ChartCardContent className="pt-0 sm:pt-0">
				<div className="flex h-40 w-full min-w-60 items-start justify-center overflow-hidden">
					<ReusableRadialBarChart
						data={[data]}
						barDataKeys={["skipped", "notSkipped"]}
						config={chartConfig}
						percentage={skippedPercentage}
						centerLabel="Tracks Skipped"
					/>
				</div>
			</ChartCardContent>
		</ChartCard>
	);
};

export const SkippedHabitsChartSkeleton = () => {
	return (
		<ChartCard>
			<ChartCardHeader
				title="Skipped Tracks"
				description="How often you skip tracks"
			/>
			<ChartCardContent className="pt-0 sm:pt-0">
				<Skeleton className="size-full h-[160px] w-[240px]" />
			</ChartCardContent>
		</ChartCard>
	);
};
