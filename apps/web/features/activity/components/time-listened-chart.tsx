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
	userId: string;
	isDemo: boolean;
	data?: Awaited<ReturnType<typeof getTimeListenedData>>;
	className?: string;
};

export const TimeListenedChart = async ({
	userId,
	isDemo,
	data,
	className,
}: TimeListenedChartProps) => {
	if (!data) {
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
					description={<NumberFlow
						value={msToHours(data.average).toFixed(2)}
						suffix=" hours"
					/>}
				/>
			</ChartCardHeader>
			<ChartCardContent>
				<ReusableBarChart
					data={data.data}
					xAxisDataKey="month"
					barDataKey="value"
					referenceLine={{
						value: data.average,
						label: "Average",
					}}
					showYAxis={false}
					tooltipLabelFormatter="average"
					labelData={data.average}
				/>
			</ChartCardContent>
		</ChartCard>
	);
};

export const TimeListenedChartSkeleton = ({
	className,
}: { className?: string }) => {
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
