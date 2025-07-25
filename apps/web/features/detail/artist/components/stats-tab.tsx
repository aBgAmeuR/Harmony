import { getUser } from "@repo/auth";
import { ReusableAreaChart } from "@repo/ui/components/charts/area-chart";
import { ReusableBarChart } from "@repo/ui/components/charts/bar-chart";
import { Skeleton } from "@repo/ui/skeleton";

import {
	ChartCard,
	ChartCardContent,
	ChartCardHeader,
} from "~/components/charts/utils/chart-card";

import { getStatsTabData } from "../data/stats-tab";

type StatsTabProps = {
	artistId: string;
};

export const StatsTab = async ({ artistId }: StatsTabProps) => {
	const { userId } = await getUser();
	const data = await getStatsTabData(artistId, userId);

	return (
		<div className="grid w-full gap-4 xl:grid-cols-2">
			<ChartCard>
				<ChartCardHeader
					showSeparator={true}
					title="Monthly Listening Activity"
					description="Total time listened in hours over the months"
				/>
				<ChartCardContent>
					<ReusableAreaChart
						data={data.monthlyTrends}
						className="aspect-video"
						areaDataKeys={["msPlayed"]}
						xAxisDataKey="month"
						showYAxis={false}
						config={{
							msPlayed: { label: "Time Played", color: "var(--chart-2)" },
						}}
						tooltipValueFormatter="hourSuffix"
					/>
				</ChartCardContent>
			</ChartCard>

			<ChartCard>
				<ChartCardHeader
					showSeparator={true}
					title="Listening Patterns"
					description="When you listen most during the day"
				/>
				<ChartCardContent>
					<ReusableBarChart
						data={data.timeDistribution}
						xAxisDataKey="hour"
						barDataKey="msPlayed"
						showYAxis={false}
						config={{
							msPlayed: { label: "Time Played", color: "var(--chart-1)" },
						}}
						tooltipLabelFormatter="hourSuffix"
						tooltipValueFormatter="hourSuffix"
						xAxisTickFormatter="hourSuffix"
						className="aspect-video"
					/>
				</ChartCardContent>
			</ChartCard>
		</div>
	);
};

export const StatsTabSkeleton = () => {
	return (
		<div className="grid w-full gap-4 xl:grid-cols-2">
			<ChartCard>
				<ChartCardHeader
					showSeparator={true}
					title="Monthly Listening Activity"
					description="Total time listened in hours over the months"
				/>
				<ChartCardContent>
					<Skeleton className="aspect-video" />
				</ChartCardContent>
			</ChartCard>

			<ChartCard>
				<ChartCardHeader
					showSeparator={true}
					title="Listening Patterns"
					description="When you listen most during the day"
				/>
				<ChartCardContent>
					<Skeleton className="aspect-video" />
				</ChartCardContent>
			</ChartCard>
		</div>
	);
};
