import {
	Calendar,
	CalendarDays,
	Clock,
	Flame,
	PlayCircle,
	TrendingUp,
} from "lucide-react";

import { getUser } from "@repo/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";

import { StatCard, StatCardSkeleton } from "~/components/cards/stat-card";

import { getStatsTabData } from "../data/stats-tab";

type StatsTabProps = {
	albumId: string;
};

export const StatsTab = async ({ albumId }: StatsTabProps) => {
	const { userId } = await getUser();
	const stats = await getStatsTabData(albumId, userId);

	return (
		<>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Total Time"
					value={`${stats.totalMinutes} minutes`}
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
					value={`${stats.monthlyAveragePlays} plays`}
					icon={TrendingUp}
					description="Average plays per month"
				/>
				<StatCard
					title="Best Month"
					value={stats.topMonth.month}
					icon={Calendar}
					description={`${stats.topMonth.msPlayed} minutes played`}
				/>
			</div>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<Card className="border-orange-400/30 dark:bg-background/80">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-orange-400">
							<Flame className="size-5" /> Listening Streaks
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-row items-center justify-center gap-6 pt-4">
						<div className="flex flex-col items-center">
							<span className="font-extrabold text-3xl text-orange-400">
								{stats.maxStreak}
							</span>
							<span className="flex items-center gap-1 text-muted-foreground text-xs">
								<Flame className="size-4" /> Longest streak
							</span>
						</div>
						<div className="flex flex-col items-center">
							<span className="font-bold text-3xl">{stats.totalDays}</span>
							<span className="flex items-center gap-1 text-muted-foreground text-xs">
								<CalendarDays className="size-4" /> Unique days
							</span>
						</div>
					</CardContent>
				</Card>
				<Card className="border-blue-400/30 dark:bg-background/80">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-blue-400">
							<Clock className="size-5" /> First & Last Listen
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-row items-center justify-center gap-6 pt-4">
						<div className="flex flex-col items-center gap-1 text-center">
							<span className="font-semibold text-lg">
								{stats.firstListen ? stats.firstListen : "N/A"}
							</span>
							<span className="flex items-center gap-1 text-muted-foreground text-xs">
								<Clock className="size-4" /> First listen
							</span>
						</div>
						<div className="flex flex-col items-center gap-1 text-center">
							<span className="font-semibold text-lg">
								{stats.lastListen ? stats.lastListen : "N/A"}
							</span>
							<span className="flex items-center gap-1 text-muted-foreground text-xs">
								<CalendarDays className="size-4" /> Last listen
							</span>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
};

export const StatsTabSkeleton = () => {
	return (
		<>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatCardSkeleton
					title="Total Time"
					value="100 minutes"
					icon={Clock}
					description="Total listening time"
				/>
				<StatCardSkeleton
					title="Total Plays"
					value="888"
					icon={PlayCircle}
					description="Total number of plays"
				/>
				<StatCardSkeleton
					title="Monthly Average"
					value="88 plays"
					icon={TrendingUp}
					description="Average plays per month"
				/>
				<StatCardSkeleton
					title="Best Month"
					value="January 2025"
					icon={Calendar}
					description="Best month"
				/>
			</div>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<Card className="border-orange-400/30 dark:bg-background/80">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-orange-400">
							<Flame className="size-5" /> Listening Streaks
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-row items-center justify-center gap-6 pt-4">
						<div className="flex flex-col items-center">
							<span className="flex font-extrabold text-3xl text-orange-400">
								<Skeleton className="my-0.5 h-8">10</Skeleton>
							</span>
							<span className="flex items-center gap-1 text-muted-foreground text-xs">
								<Flame className="size-4" /> Longest streak
							</span>
						</div>
						<div className="flex flex-col items-center">
							<span className="flex font-bold text-3xl">
								<Skeleton className="my-0.5 h-8">100</Skeleton>
							</span>
							<span className="flex items-center gap-1 text-muted-foreground text-xs">
								<CalendarDays className="size-4" /> Unique days
							</span>
						</div>
					</CardContent>
				</Card>
				<Card className="border-blue-400/30 dark:bg-background/80">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-blue-400">
							<Clock className="size-5" /> First & Last Listen
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-row items-center justify-center gap-6 pt-4">
						<div className="flex flex-col items-center gap-1 text-center">
							<span className="flex font-semibold text-lg">
								<Skeleton className="my-0.5 h-6">December 22, 2024</Skeleton>
							</span>
							<span className="flex items-center gap-1 text-muted-foreground text-xs">
								<Clock className="size-4" /> First listen
							</span>
						</div>
						<div className="flex flex-col items-center gap-1 text-center">
							<span className="flex font-semibold text-lg">
								<Skeleton className="my-0.5 h-6">December 22, 2024</Skeleton>
							</span>
							<span className="flex items-center gap-1 text-muted-foreground text-xs">
								<CalendarDays className="size-4" /> Last listen
							</span>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
};
