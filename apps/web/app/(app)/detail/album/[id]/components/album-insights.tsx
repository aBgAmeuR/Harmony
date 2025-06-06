"use client";

import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { Badge } from "@repo/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/card";
import { Brain, Lightbulb, Music2, Star, Target, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface AlbumInsightsProps {
	albumId: string;
	userId?: string;
}

interface AlbumInsight {
	type: "achievement" | "recommendation" | "pattern" | "milestone";
	icon: typeof Brain;
	title: string;
	description: string;
	metadata?: {
		value?: string;
		percentage?: number;
		date?: string;
	};
}

// Mock function to get album insights
async function getAlbumInsights(
	albumId: string,
	userId?: string,
): Promise<AlbumInsight[]> {
	// TODO: Implement proper API call
	return [
		{
			type: "achievement",
			icon: Star,
			title: "Super Fan Status",
			description: "You're in the top 5% of listeners for this album!",
			metadata: {
				percentage: 95,
			},
		},
		{
			type: "pattern",
			icon: Brain,
			title: "Weekend Warrior",
			description: "You tend to listen to this album most on Saturday evenings",
			metadata: {
				value: "Saturday, 8-10 PM",
			},
		},
		{
			type: "milestone",
			icon: Target,
			title: "100 Plays Milestone",
			description: "You've reached 100 total plays of this album!",
			metadata: {
				date: "January 15, 2024",
			},
		},
		{
			type: "recommendation",
			icon: Lightbulb,
			title: "Hidden Gem",
			description:
				"Track 7 has the lowest play count - give it another listen!",
			metadata: {
				value: "Only 3 plays",
			},
		},
		{
			type: "pattern",
			icon: Music2,
			title: "Seasonal Favorite",
			description: "Your listening peaks during winter months",
			metadata: {
				value: "December - February",
			},
		},
		{
			type: "achievement",
			icon: Zap,
			title: "Marathon Listener",
			description:
				"You've listened to the entire album 12 times from start to finish",
			metadata: {
				value: "12 complete plays",
			},
		},
	];
}

export function AlbumInsights({ albumId, userId }: AlbumInsightsProps) {
	const [insights, setInsights] = useState<AlbumInsight[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getAlbumInsights(albumId, userId).then((data) => {
			setInsights(data);
			setLoading(false);
		});
	}, [albumId, userId]);

	if (loading) {
		return <InsightsSkeleton />;
	}

	const getTypeColor = (type: AlbumInsight["type"]) => {
		switch (type) {
			case "achievement":
				return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500";
			case "recommendation":
				return "bg-blue-500/10 text-blue-600 dark:text-blue-500";
			case "pattern":
				return "bg-purple-500/10 text-purple-600 dark:text-purple-500";
			case "milestone":
				return "bg-green-500/10 text-green-600 dark:text-green-500";
		}
	};

	const typeLabels = {
		achievement: "Achievement",
		recommendation: "Suggestion",
		pattern: "Pattern",
		milestone: "Milestone",
	};

	return (
		<div className="space-y-6">
			<Alert>
				<Brain className="h-4 w-4" />
				<AlertTitle>Album Insights</AlertTitle>
				<AlertDescription>
					Personalized insights based on your listening history and patterns
				</AlertDescription>
			</Alert>

			<div className="grid gap-4 md:grid-cols-2">
				{insights.map((insight, index) => {
					const Icon = insight.icon;
					return (
						<Card key={index} className="overflow-hidden">
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-3">
										<div
											className={`rounded-lg p-2 ${getTypeColor(insight.type)}`}
										>
											<Icon className="h-5 w-5" />
										</div>
										<Badge variant="secondary" className="text-xs">
											{typeLabels[insight.type]}
										</Badge>
									</div>
								</div>
								<CardTitle className="mt-3 text-lg">{insight.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="mb-3 text-muted-foreground text-sm">
									{insight.description}
								</p>
								{insight.metadata && (
									<div className="flex items-center gap-2 text-sm">
										{insight.metadata.value && (
											<Badge variant="outline" className="font-mono">
												{insight.metadata.value}
											</Badge>
										)}
										{insight.metadata.percentage && (
											<Badge variant="outline" className="font-mono">
												Top {insight.metadata.percentage}%
											</Badge>
										)}
										{insight.metadata.date && (
											<Badge variant="outline">{insight.metadata.date}</Badge>
										)}
									</div>
								)}
							</CardContent>
						</Card>
					);
				})}
			</div>

			<Card className="bg-muted/50">
				<CardHeader>
					<CardTitle className="text-lg">More insights coming soon!</CardTitle>
					<CardDescription>
						We're analyzing your listening patterns to provide even more
						personalized insights. Check back later for updates.
					</CardDescription>
				</CardHeader>
			</Card>
		</div>
	);
}

import { Skeleton } from "@repo/ui/skeleton";

function InsightsSkeleton() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<Skeleton className="h-4 w-4" />
					<Skeleton className="mt-2 h-5 w-32" />
					<Skeleton className="mt-1 h-4 w-64" />
				</CardHeader>
			</Card>
			<div className="grid gap-4 md:grid-cols-2">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i}>
						<CardHeader className="pb-3">
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-3">
									<Skeleton className="h-9 w-9 rounded-lg" />
									<Skeleton className="h-5 w-20" />
								</div>
							</div>
							<Skeleton className="mt-3 h-5 w-48" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-4 w-full" />
							<Skeleton className="mt-1 h-4 w-3/4" />
							<Skeleton className="mt-3 h-6 w-24" />
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
