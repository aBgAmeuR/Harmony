import { ReusableAreaChart } from "@repo/ui/components/charts/area-chart";
import { ReusableBarChart } from "@repo/ui/components/charts/bar-chart";

import {
	ChartCard,
	ChartCardContent,
	ChartCardHeader,
} from "~/components/charts/utils/chart-card";

import { getListeningTabData } from "../data/listening-tab";

type ListeningTabProps = {
	albumId: string;
	userId: string;
};

export const ListeningTab = async ({ albumId, userId }: ListeningTabProps) => {
	const data = await getListeningTabData(albumId, userId);

	return (
		<>
			<ChartCard>
				<ChartCardHeader
					title="Monthly Listening Trends"
					description="Your listening activity for this album over time"
					showSeparator={true}
				/>
				<ChartCardContent>
					<ReusableAreaChart
						data={data.monthlyTrends}
						showYAxis={false}
						xAxisDataKey="month"
						areaDataKeys={["msPlayed"]}
						config={{
							msPlayed: { label: "Time Played", color: "var(--chart-2)" },
						}}
						tooltipValueFormatter="hourSuffix"
					/>
				</ChartCardContent>
			</ChartCard>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<ChartCard>
					<ChartCardHeader
						title="Time of Day Distribution"
						description="When you typically listen to this album"
						showSeparator={true}
					/>
					<ChartCardContent>
						<ReusableBarChart
							data={data.timeDistribution}
							showYAxis={false}
							xAxisDataKey="hour"
							barDataKey="msPlayed"
							config={{
								msPlayed: { label: "Time Played", color: "var(--chart-1)" },
							}}
							tooltipLabelFormatter="hourSuffix"
							tooltipValueFormatter="hourSuffix"
							xAxisTickFormatter="hourSuffix"
						/>
					</ChartCardContent>
				</ChartCard>

				<ChartCard>
					<ChartCardHeader
						title="Top Listening Days"
						description="Your 10 most listened days for this album"
						showSeparator={true}
					/>
					<ChartCardContent>
						<ReusableBarChart
							data={data.topDays}
							showYAxis={false}
							xAxisDataKey="date"
							barDataKey="msPlayed"
							config={{
								msPlayed: { label: "Time Played", color: "var(--chart-2)" },
							}}
							tooltipValueFormatter="hourSuffix"
						/>
					</ChartCardContent>
				</ChartCard>
			</div>
		</>
	);
};
