import { getUser } from "@repo/auth";
import { ReusableBarChart } from "@repo/ui/components/charts/bar-chart";
import { NumberFlow } from "@repo/ui/components/number";
import { Skeleton } from "@repo/ui/skeleton";

import {
	ChartCard,
	ChartCardContent,
	ChartCardHeader,
	ChartCardHeaderContent,
} from "~/components/charts/utils/chart-card";
import { msToHours } from "~/lib/utils";

import { getTimeListenedData } from "../data/time-listened";

type TimeListenedChartProps = {
	data?: Awaited<ReturnType<typeof getTimeListenedData>>;
	className?: string;
};

export const TimeListenedChart = async ({
	data,
	className,
}: TimeListenedChartProps) => {
	if (!data) {
		const { userId, isDemo } = await getUser();
		data = await getTimeListenedData(userId, isDemo);
		if (!data) return null;
	}

	return (
		<ChartCard className={className}>
			<ChartCardHeader
				showSeparator={true}
				title="Time Listened Over Months"
				description="Showing total time listened in hours over the months"
			>
				<ChartCardHeaderContent
					title="Average time listened"
					description={
						<NumberFlow
							value={msToHours(data.average).toFixed(2)}
							suffix=" hours"
						/>
					}
				/>
			</ChartCardHeader>
			<ChartCardContent>
				<ReusableBarChart
					config={{ value: { label: "Time Played", color: "var(--chart-1)" } }}
					data={data.data}
					xAxisDataKey="month"
					barDataKeys={["value"]}
					referenceLine={{ value: data.average, label: "Average" }}
					showYAxis={false}
					tooltipLabelFormatter="average"
					tooltipValueFormatter="hourSuffix"
					labelData={data.average}
				/>
			</ChartCardContent>
		</ChartCard>
	);
};

export const TimeListenedChartSkeleton = ({
	className,
}: {
	className?: string;
}) => {
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
};
