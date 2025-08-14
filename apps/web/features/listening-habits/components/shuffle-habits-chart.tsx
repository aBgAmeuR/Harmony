import { getUser } from "@repo/auth";
import type { ChartConfig } from "@repo/ui/chart";
import { ReusableRadialBarChart } from "@repo/ui/components/charts/radial-bar-chart";
import { Skeleton } from "@repo/ui/skeleton";

import {
	ChartCard,
	ChartCardContent,
	ChartCardHeader,
} from "~/components/charts/utils/chart-card";

import { getShuffleHabitsData } from "../data/shuffle-habits";

type ShuffleHabitsChartComponentProps = {
	data?: Awaited<ReturnType<typeof getShuffleHabitsData>>;
};

export const ShuffleHabitsChart = async ({ data }: ShuffleHabitsChartComponentProps) => {
	const { userId, isDemo } = await getUser();

	if (!data) {
		data = await getShuffleHabitsData(userId, isDemo);
		if (!data) return null;
	}

	const totalTracks = data.shuffled + data.notShuffled;
	const shufflePercentage = Math.round((data.shuffled / totalTracks) * 100);

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
			<ChartCardContent className="pt-0 sm:pt-0">
				<div className="flex h-40 w-full min-w-60 items-start justify-center overflow-hidden">
					<ReusableRadialBarChart
						data={[data]}
						barDataKeys={["shuffled", "notShuffled"]}
						config={chartConfig}
						percentage={shufflePercentage}
						centerLabel="Tracks Shuffled"
					/>
				</div>
			</ChartCardContent>
		</ChartCard>
	);
};

export const ShuffleHabitsChartSkeleton = () => {
	return (
		<ChartCard>
			<ChartCardHeader
				title="Shuffled Mode"
				description="How often you use shuffle"
			/>
			<ChartCardContent className="pt-0 sm:pt-0">
				<Skeleton className="size-full h-[160px] w-[240px]" />
			</ChartCardContent>
		</ChartCard>
	);
};
