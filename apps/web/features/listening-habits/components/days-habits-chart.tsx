import { ReusableBarChart } from "@repo/ui/components/charts/bar-chart";
import { Skeleton } from "@repo/ui/skeleton";

import {
	ChartCard,
	ChartCardContent,
	ChartCardHeader,
} from "~/components/charts/utils/chart-card";

import { getDaysHabitsData } from "../data/days-habits";

type DaysHabitsChartComponentProps = {
	userId: string;
	isDemo: boolean;
	data?: Awaited<ReturnType<typeof getDaysHabitsData>>;
};

export const DaysHabitsChart = async ({
	userId,
	isDemo,
	data,
}: DaysHabitsChartComponentProps) => {
	if (!data) {
		data = await getDaysHabitsData(userId, isDemo);
		if (!data) return null;
	}

	return (
		<ChartCard>
			<ChartCardHeader
				title="Listening by Day"
				description="When you listen most during the week"
			/>
			<ChartCardContent>
				<ReusableBarChart
					data={data}
					xAxisDataKey="day"
					barDataKey="msPlayed"
					config={{
						msPlayed: { label: "Time Played", color: "var(--chart-1)" },
					}}
					showYAxis={false}
					className="aspect-video"
					showBarLabels={true}
					yAxisTickFormatter="msToHours"
					barLabelFormatter="msToHoursWithDecimal"
					tooltipValueFormatter="hourSuffix"
					barRadius={8}
				/>
			</ChartCardContent>
		</ChartCard>
	);
};

export const DaysHabitsChartSkeleton = () => {
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
};
