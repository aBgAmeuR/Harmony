import { ReusablePieChart } from "@repo/ui/components/charts/pie-chart";
import { Skeleton } from "@repo/ui/skeleton";

import {
	ChartCard,
	ChartCardContent,
	ChartCardHeader,
} from "~/components/charts/utils/chart-card";
import { getMsPlayedInHours } from "~/components/charts/utils/time-formatters";

import { getTopPlatformsData } from "../data/top-platforms";

type TopPlatformsChartComponentProps = {
	userId: string;
	isDemo: boolean;
	data?: Awaited<ReturnType<typeof getTopPlatformsData>>;
};

export const TopPlatformsChart = async ({
	userId,
	isDemo,
	data,
}: TopPlatformsChartComponentProps) => {
	if (!data) {
		data = await getTopPlatformsData(userId, isDemo);
		if (!data) return null;
	}

	const totalListeningTime = data.reduce(
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
					config={{
						msPlayed: { label: "Time Played", color: "var(--chart-1)" },
					}}
					data={data}
					valueDataKey="msPlayed"
					nameKey="platform"
					centerLabel="Hours listened"
					centerValue={`${getMsPlayedInHours(totalListeningTime, false)}h`}
					tooltipValueFormatter="hourSuffix"
				/>
			</ChartCardContent>
		</ChartCard>
	);
};

export const TopPlatformsChartSkeleton = () => {
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
};
