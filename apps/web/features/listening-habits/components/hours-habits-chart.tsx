import { ReusableAreaChart } from "@repo/ui/components/charts/area-chart";
import { Skeleton } from "@repo/ui/skeleton";

import {
	ChartCard,
	ChartCardContent,
	ChartCardHeader,
} from "~/components/charts/utils/chart-card";

import { getHoursHabitsData } from "../data/hours-habits";

type HoursHabitsChartComponentProps = {
	userId: string;
	isDemo: boolean;
	data?: Awaited<ReturnType<typeof getHoursHabitsData>>;
};

export const HoursHabitsChart = async ({
	userId,
	isDemo,
	data,
}: HoursHabitsChartComponentProps) => {
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
			<ChartCardContent>
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
			<ChartCardContent>
				<Skeleton className="aspect-video" />
			</ChartCardContent>
		</ChartCard>
	);
};
