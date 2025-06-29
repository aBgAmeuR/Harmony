import { Brain } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { ReusableRadarChart } from "@repo/ui/components/charts/radar-chart";
import { Skeleton } from "@repo/ui/skeleton";

import { getListeningPatternData } from "../data/listening-pattern-chart";

type ListeningPatternChartProps = {
	data?: Awaited<ReturnType<typeof getListeningPatternData>>;
	userId: string;
	isDemo: boolean;
};

export async function ListeningPatternChart({
	data,
	userId,
	isDemo,
}: ListeningPatternChartProps) {
	if (!data) {
		data = await getListeningPatternData(userId, isDemo);
		if (!data) return null;
	}

	return (
		<Card className="pb-0">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="font-medium text-sm">
					Listening Patterns
				</CardTitle>
				<Brain className="size-4 text-muted-foreground" />
			</CardHeader>
			<CardContent className="size-full max-h-56 pb-0 md:max-h-52 lg:max-h-64 xl:max-h-80 2xl:max-h-[350px]">
				<ReusableRadarChart
					data={data}
					angleAxisDataKey="subject"
					radarDataKeys={["time"]}
					config={{ time: { label: "Time Played", color: "var(--chart-1)" } }}
					className="mx-auto aspect-square size-full w-56 md:w-52 lg:w-64 xl:w-80 2xl:w-[350px]"
					tooltipValueFormatter="hourSuffix"
				/>
			</CardContent>
		</Card>
	);
}

export const ListeningPatternChartSkeleton = () => {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="font-medium text-sm">
					Listening Patterns
				</CardTitle>
				<Brain className="size-4 text-muted-foreground" />
			</CardHeader>
			<CardContent className="size-full max-h-56 md:max-h-52 lg:max-h-64 xl:max-h-80 2xl:max-h-[350px] ">
				<div className="mx-auto aspect-square w-56 md:w-52 lg:w-64 xl:w-80 2xl:w-[350px] ">
					<div className="size-full pb-6">
						<Skeleton className="size-full" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
