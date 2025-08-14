import { getUser } from "@repo/auth";
import { ReusableAreaChart } from "@repo/ui/components/charts/area-chart";
import { Skeleton } from "@repo/ui/skeleton";

import {
	ChartCard,
	ChartCardContent,
	ChartCardHeader,
} from "~/components/charts/utils/chart-card";

import { getHoursHabitsData } from "../data/hours-habits";

type HoursHabitsChartComponentProps = {
	data?: Awaited<ReturnType<typeof getHoursHabitsData>>;
};

export const HoursHabitsChart = async ({ data }: HoursHabitsChartComponentProps) => {
	const { userId, isDemo } = await getUser();

	if (!data) {
		data = await getHoursHabitsData(userId, isDemo);
		if (!data) return null;
	}

	return (
		<ChartCard>
			<ChartCardHeader
				title="Listening Hours"
				description="When you listen most during the day"
			/>
			<ChartCardContent className="pt-0 sm:pt-0">
				<ReusableAreaChart
					data={data}
					className="aspect-video"
					areaDataKeys={["msPlayed"]}
					xAxisDataKey="hour"
					showYAxis={false}
					config={{ msPlayed: { label: "Time Played", color: "var(--chart-2)" } }}
					xAxisTickFormatter="hourSuffix"
					tooltipValueFormatter="hourSuffix"
					tooltipLabelFormatter="hourSuffix"
				/>
			</ChartCardContent>
		</ChartCard>
	);
};

export const HoursHabitsChartSkeleton = () => {
	return (
		<ChartCard>
			<ChartCardHeader
				title="Listening Hours"
				description="When you listen most during the day"
			/>
			<ChartCardContent className="pt-0 sm:pt-0">
				<Skeleton className="aspect-video" />
			</ChartCardContent>
		</ChartCard>
	);
};
