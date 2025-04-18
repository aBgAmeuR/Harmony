import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { NumberFlow } from "@repo/ui/components/number";
import { cn } from "@repo/ui/lib/utils";
import {
	ArrowDownRight,
	ArrowUpRight,
	Brain,
	Calendar,
	Clock,
	type LucideIcon,
	PlayCircle,
	StopCircle,
	TrendingUp,
} from "lucide-react";

type ArtistStatsSummaryProps = {
	stats: {
		totalMinutes: number;
		totalStreams: number;
		topMonth: {
			month: string;
			msPlayed: number;
		};
		monthlyAverageStreams: number;
		monthlyAverageMinutes: number;
		streamProgress: number;
	};
};

type TimeStats = {
	totalMinutes: number;
	monthlyAvg: number;
	timeUnit: string;
};

function convertTime(minutes: number): TimeStats {
	if (minutes >= 60) {
		return {
			totalMinutes: Math.round(minutes / 60),
			monthlyAvg: +(minutes / 60 / 12).toFixed(1),
			timeUnit: "hours",
		};
	}
	return {
		totalMinutes: minutes,
		monthlyAvg: +(minutes / 12).toFixed(1),
		timeUnit: "minutes",
	};
}

export function ArtistStatsSummary({ stats }: ArtistStatsSummaryProps) {
	const timeStats = convertTime(stats.totalMinutes);

	// const monthlyChange =
	// 	stats.monthlyAverageStreams > stats.topMonth.streams
	// 		? (stats.monthlyAverageStreams - stats.topMonth.streams) /
	// 			stats.topMonth.streams
	// 		: (stats.topMonth.streams - stats.monthlyAverageStreams) /
	// 			stats.monthlyAverageStreams;

	// const isPositiveTrend = stats.monthlyAverageStreams >= stats.topMonth.streams;

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<CommonCard title="Listening Time" icon={Clock}>
				<div>
					<p className="font-bold text-2xl">
						{timeStats.totalMinutes} {timeStats.timeUnit}
					</p>
					<p className="mt-1 text-muted-foreground text-xs">
						{`Average ${timeStats.monthlyAvg} ${timeStats.timeUnit} per month`}
					</p>
				</div>
				<div className="flex items-center gap-2 text-xs">
					<StopCircle className="size-3" />
					<div className="flex-1">Recent session</div>
					<p>{Math.round(stats.totalMinutes / stats.totalStreams)} min/track</p>
				</div>
			</CommonCard>

			<CommonCard title="Monthly Activity" icon={Calendar}>
				<div>
					<p className="font-bold text-2xl">
						{stats.monthlyAverageStreams}
						<span className="ml-2 font-normal text-muted-foreground text-sm">
							plays/month
						</span>
					</p>
					<div className="mt-1 flex items-center gap-2">
						{/* {isPositiveTrend ? (
							<ArrowUpRight className="size-4 text-green-500" />
						) : (
							<ArrowDownRight className="size-4 text-red-500" />
						)}
						<span
							className={cn(
								"text-sm",
								isPositiveTrend ? "text-green-500" : "text-red-500",
							)}
						>
							<NumberFlow
								value={monthlyChange}
								format={{ style: "percent", minimumFractionDigits: 1 }}
							/>
						</span> */}
					</div>
				</div>
			</CommonCard>

			<CommonCard title="Peak Month" icon={TrendingUp}>
				<div>
					<div className="font-bold text-2xl">{stats.topMonth.month}</div>
					<div className="mt-1 flex items-center gap-2">
						<PlayCircle className="size-4 text-muted-foreground" />
						<span className="text-muted-foreground text-sm">
							Most active month
						</span>
					</div>
				</div>
				<div className="flex flex-col gap-2 text-muted-foreground text-sm">
					<div className="flex items-center justify-between">
						<span>Total plays:</span>
						<div className="flex items-center gap-1">
							<p>{stats.topMonth.msPlayed}</p>
							<Brain className="size-3 text-muted-foreground/50" />
						</div>
					</div>
					<div className="flex items-center justify-between">
						<span>Minutes listened:</span>
						<div className="flex items-center gap-1">
							<p>{stats.topMonth.msPlayed}</p>
							<Clock className="size-3 text-muted-foreground/50" />
						</div>
					</div>
				</div>
			</CommonCard>
		</div>
	);
}

type CommonCardProps = {
	title: string;
	icon: LucideIcon;
	children: React.ReactNode;
};

export function CommonCard({ title, icon: Icon, children }: CommonCardProps) {
	return (
		<Card>
			<CardHeader className="px-6 pt-6 pb-4">
				<div className="flex justify-between">
					{/* biome-ignore lint/nursery/useSortedClasses: <explanation> */}
					<CardTitle className="text-sm font-medium">{title}</CardTitle>
					<Icon className="size-4 text-muted-foreground" />
				</div>
			</CardHeader>
			<CardContent className="space-y-3">{children}</CardContent>
		</Card>
	);
}
