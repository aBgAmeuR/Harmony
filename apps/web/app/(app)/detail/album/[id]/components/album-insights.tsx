import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { Badge } from "@repo/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Brain } from "lucide-react";

interface AlbumInsight {
	type: "achievement" | "recommendation" | "pattern" | "milestone";
	icon: any;
	title: string;
	description: string;
	metadata?: {
		value?: string;
		percentage?: number;
		date?: string;
	};
}

interface AlbumInsightsProps {
	insights: AlbumInsight[];
}

export function AlbumInsights({ insights }: AlbumInsightsProps) {
	if (!insights?.length) return <InsightsSkeleton />;

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
								{insight.metadata?.value && (
									<div className="text-muted-foreground text-xs">
										{insight.metadata.value}
									</div>
								)}
								{insight.metadata?.date && (
									<div className="text-muted-foreground text-xs">
										{insight.metadata.date}
									</div>
								)}
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}

function InsightsSkeleton() {
	return (
		<div className="space-y-6">
			<Alert>
				<Brain className="h-4 w-4 animate-pulse" />
				<AlertTitle>
					<span className="block h-4 w-32 rounded bg-muted" />
				</AlertTitle>
				<AlertDescription>
					<span className="block h-4 w-64 rounded bg-muted" />
				</AlertDescription>
			</Alert>
			<div className="grid gap-4 md:grid-cols-2">
				{Array.from({ length: 2 }).map((_, i) => (
					<Card key={i} className="overflow-hidden">
						<CardHeader className="pb-3">
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-3">
									<div className="rounded-lg bg-muted p-2" />
									<Badge variant="secondary" className="text-xs">
										<span className="block h-4 w-16 rounded bg-muted" />
									</Badge>
								</div>
							</div>
							<CardTitle className="mt-3 text-lg">
								<span className="block h-4 w-32 rounded bg-muted" />
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="mb-3 text-muted-foreground text-sm">
								<span className="block h-4 w-48 rounded bg-muted" />
							</p>
							<div className="text-muted-foreground text-xs">
								<span className="block h-4 w-24 rounded bg-muted" />
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
