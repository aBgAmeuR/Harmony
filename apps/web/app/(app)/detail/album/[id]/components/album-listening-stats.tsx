import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/card";
import { Progress } from "@repo/ui/progress";
import {
	Calendar,
	Clock,
	Headphones,
	Sparkles,
	TrendingUp,
} from "lucide-react";

interface AlbumListeningStatsProps {
	globalStats: {
		totalplays: number;
		totalminutes: number;
		firstlisten: Date | string | null;
		lastlisten: Date | string | null;
	};
	favoriteTrack?: {
		id: string;
		name: string;
		plays: number;
	} | null;
	monthlyTrend?: { month: string; plays: number }[];
	detailed?: boolean;
}

export function AlbumListeningStats({
	globalStats,
	favoriteTrack,
	monthlyTrend = [],
	detailed = false,
}: AlbumListeningStatsProps) {
	if (!globalStats?.totalplays)
		return <StatsSkeletonGrid detailed={detailed} />;

	const formatDate = (date: Date | string | null) => {
		if (!date) return "-";
		return new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const statsCards = [
		{
			title: "Total Plays",
			value: globalStats.totalplays.toString(),
			description: "Times you've played this album",
			icon: Headphones,
			color: "text-blue-500",
		},
		{
			title: "Listening Time",
			value: `${Math.floor(globalStats.totalminutes / 60)}h ${globalStats.totalminutes % 60}m`,
			description: "Total time spent listening",
			icon: Clock,
			color: "text-green-500",
		},
		{
			title: "Favorite Track",
			value: favoriteTrack?.name || "-",
			description: favoriteTrack ? `${favoriteTrack.plays} plays` : "-",
			icon: Sparkles,
			color: "text-purple-500",
		},
		{
			title: "Average Completion",
			value: "85%",
			description: "How much of the album you typically listen to",
			icon: TrendingUp,
			color: "text-orange-500",
		},
	];

	const detailedStats = [
		{
			title: "First Listen",
			value: formatDate(globalStats.firstlisten),
			description: "When you discovered this album",
			icon: Calendar,
			color: "text-indigo-500",
		},
		{
			title: "Last Listen",
			value: formatDate(globalStats.lastlisten),
			description: "Most recent listen",
			icon: Calendar,
			color: "text-indigo-500",
		},
	];

	const allStats = detailed ? [...statsCards, ...detailedStats] : statsCards;

	return (
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{allStats.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<Card key={index}>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="font-medium text-sm">
									{stat.title}
								</CardTitle>
								<Icon className={`h-4 w-4 ${stat.color}`} />
							</CardHeader>
							<CardContent>
								<div className="font-bold text-2xl">{stat.value}</div>
								<p className="text-muted-foreground text-xs">
									{stat.description}
								</p>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{detailed && monthlyTrend && monthlyTrend.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Monthly Listening Trend</CardTitle>
						<CardDescription>
							Your listening pattern over the last 6 months
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{monthlyTrend.map((month, index) => (
								<div key={index} className="space-y-2">
									<div className="flex items-center justify-between text-sm">
										<span>{month.month}</span>
										<span className="text-muted-foreground">
											{month.plays} plays
										</span>
									</div>
									<Progress
										value={
											(month.plays /
												Math.max(...monthlyTrend.map((m) => m.plays))) *
											100
										}
										className="h-2"
									/>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

function StatsSkeletonGrid({ detailed }: { detailed?: boolean }) {
	const count = detailed ? 6 : 4;
	return (
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: count }).map((_, i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="font-medium text-sm">
								<span className="block h-4 w-24 rounded bg-muted" />
							</CardTitle>
							<span className="block h-4 w-4 rounded bg-muted" />
						</CardHeader>
						<CardContent>
							<div className="mb-2 h-8 w-32 rounded bg-muted" />
							<div className="h-3 w-48 rounded bg-muted" />
						</CardContent>
					</Card>
				))}
			</div>
			{detailed && (
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">
							<span className="block h-6 w-48 rounded bg-muted" />
						</CardTitle>
						<CardDescription>
							<span className="block h-4 w-64 rounded bg-muted" />
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="block h-4 w-12 rounded bg-muted" />
										<span className="block h-4 w-16 rounded bg-muted" />
									</div>
									<span className="block h-2 w-full rounded bg-muted" />
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
