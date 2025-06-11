import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { NumberFlow } from "@repo/ui/components/number";
import { cn } from "@repo/ui/lib/utils";
import {
	ArrowDownRight,
	ArrowUpRight,
	Calendar,
	Clock,
	PlayCircle,
	TrendingUp,
} from "lucide-react";
import { getMsPlayedInMinutes } from "~/lib/utils";

import { getAlbumStats } from "~/services/details/get-album-details";

type AlbumStatsProps = {
	albumId: string;
	userId?: string;
};

export async function AlbumStats({ albumId, userId }: AlbumStatsProps) {
	const stats = await getAlbumStats(userId, albumId);
	if (!stats) return null;

	const formattedMonth = stats.topMonth.month || "N/A";

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<StatCard
				title="Total Time"
				value={stats.totalMinutes}
				suffix=" minutes"
				icon={Clock}
				description="Total listening time"
			/>
			<StatCard
				title="Total Plays"
				value={stats.totalStreams}
				icon={PlayCircle}
				description="Total number of plays"
			/>
			<StatCard
				title="Monthly Average"
				value={stats.monthlyAverageStreams}
				suffix=" plays"
				icon={TrendingUp}
				description="Average plays per month"
			/>
			<StatCard
				title="Best Month"
				value={formattedMonth}
				icon={Calendar}
				description={`${stats.topMonth.msPlayed} minutes played`}
			/>
		</div>
	);
}

type StatCardProps = {
	title: string;
	value: number | string;
	suffix?: string;
	icon: React.ElementType;
	description: string;
	trend?: {
		value: number;
		isPositive: boolean;
	};
};

function StatCard({
	title,
	value,
	suffix,
	icon: Icon,
	description,
	trend,
}: StatCardProps) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="font-medium text-sm">{title}</CardTitle>
				<Icon className="size-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="flex items-baseline gap-2">
					{typeof value === "number" ? (
						<NumberFlow
							value={value}
							suffix={suffix}
							format={{ notation: "standard" }}
							className="font-bold text-2xl"
						/>
					) : (
						<div className="font-bold text-2xl">{value}</div>
					)}
					{trend && (
						<div
							className={cn(
								"flex items-center text-xs",
								trend.isPositive ? "text-green-500" : "text-red-500",
							)}
						>
							{trend.isPositive ? (
								<ArrowUpRight className="size-3" />
							) : (
								<ArrowDownRight className="size-3" />
							)}
							<span>{Math.abs(trend.value)}%</span>
						</div>
					)}
				</div>
				<p className="text-muted-foreground text-xs">{description}</p>
			</CardContent>
		</Card>
	);
}
