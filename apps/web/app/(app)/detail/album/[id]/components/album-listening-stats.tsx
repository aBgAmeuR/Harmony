"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/card";
import { Progress } from "@repo/ui/progress";
import {
	BarChart,
	Calendar,
	Clock,
	Headphones,
	Sparkles,
	TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

interface AlbumListeningStatsProps {
	albumId: string;
	userId?: string;
	detailed?: boolean;
}

interface AlbumStats {
	totalListens: number;
	totalMinutes: number;
	favoriteTrack: {
		name: string;
		plays: number;
	};
	firstListenDate: string;
	lastListenDate: string;
	averageCompletion: number;
	peakListeningDay: {
		date: string;
		plays: number;
	};
	monthlyTrend: Array<{
		month: string;
		plays: number;
	}>;
}

// Mock function to get album stats
async function getAlbumStats(
	albumId: string,
	userId?: string,
): Promise<AlbumStats> {
	// TODO: Implement proper API call
	return {
		totalListens: 156,
		totalMinutes: 624,
		favoriteTrack: {
			name: "Track 3",
			plays: 45,
		},
		firstListenDate: "2023-06-15",
		lastListenDate: "2024-01-20",
		averageCompletion: 82,
		peakListeningDay: {
			date: "2023-12-25",
			plays: 12,
		},
		monthlyTrend: [
			{ month: "Jan", plays: 12 },
			{ month: "Feb", plays: 8 },
			{ month: "Mar", plays: 15 },
			{ month: "Apr", plays: 20 },
			{ month: "May", plays: 18 },
			{ month: "Jun", plays: 25 },
		],
	};
}

export function AlbumListeningStats({
	albumId,
	userId,
	detailed = false,
}: AlbumListeningStatsProps) {
	const [stats, setStats] = useState<AlbumStats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getAlbumStats(albumId, userId).then((data) => {
			setStats(data);
			setLoading(false);
		});
	}, [albumId, userId]);

	if (loading || !stats) {
		return <StatsSkeletonGrid detailed={detailed} />;
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const statsCards = [
		{
			title: "Total Plays",
			value: stats.totalListens.toString(),
			description: "Times you've played this album",
			icon: Headphones,
			color: "text-blue-500",
		},
		{
			title: "Listening Time",
			value: `${Math.floor(stats.totalMinutes / 60)}h ${stats.totalMinutes % 60}m`,
			description: "Total time spent listening",
			icon: Clock,
			color: "text-green-500",
		},
		{
			title: "Favorite Track",
			value: stats.favoriteTrack.name,
			description: `${stats.favoriteTrack.plays} plays`,
			icon: Sparkles,
			color: "text-purple-500",
		},
		{
			title: "Average Completion",
			value: `${stats.averageCompletion}%`,
			description: "How much of the album you typically listen to",
			icon: TrendingUp,
			color: "text-orange-500",
		},
	];

	const detailedStats = [
		{
			title: "First Listen",
			value: formatDate(stats.firstListenDate),
			description: "When you discovered this album",
			icon: Calendar,
			color: "text-indigo-500",
		},
		{
			title: "Peak Day",
			value: formatDate(stats.peakListeningDay.date),
			description: `${stats.peakListeningDay.plays} plays in one day`,
			icon: BarChart,
			color: "text-red-500",
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
								<CardTitle className="text-sm font-medium">
									{stat.title}
								</CardTitle>
								<Icon className={`h-4 w-4 ${stat.color}`} />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{stat.value}</div>
								<p className="text-muted-foreground text-xs">
									{stat.description}
								</p>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{detailed && stats.monthlyTrend && (
				<Card>
					<CardHeader>
						<CardTitle>Monthly Listening Trend</CardTitle>
						<CardDescription>
							Your listening pattern over the last 6 months
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{stats.monthlyTrend.map((month, index) => (
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
												Math.max(...stats.monthlyTrend.map((m) => m.plays))) *
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

import { Skeleton } from "@repo/ui/skeleton";

function StatsSkeletonGrid({ detailed }: { detailed?: boolean }) {
	const count = detailed ? 6 : 4;
	return (
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: count }).map((_, i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-4" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-32" />
							<Skeleton className="mt-1 h-3 w-48" />
						</CardContent>
					</Card>
				))}
			</div>
			{detailed && (
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-4 w-64" />
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="space-y-2">
									<div className="flex items-center justify-between">
										<Skeleton className="h-4 w-12" />
										<Skeleton className="h-4 w-16" />
									</div>
									<Skeleton className="h-2 w-full" />
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
