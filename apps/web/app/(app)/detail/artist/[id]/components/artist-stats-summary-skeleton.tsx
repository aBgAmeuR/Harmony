import { Card, CardContent, CardHeader } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";
import { Brain, Calendar, Clock, TrendingUp } from "lucide-react";

export function ArtistStatsSummarySkeleton() {
	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{/* Listening Time Card */}
			<Card>
				<CardHeader>
					<div className="flex justify-between">
						<Skeleton className="h-5 w-28" />
						<Clock className="size-4 opacity-50" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div>
							<Skeleton className="h-8 w-32" />
							<Skeleton className="h-4 w-44 mt-1" />
						</div>
						<div className="flex items-center gap-2">
							<Skeleton className="size-3" />
							<div className="flex-1">
								<Skeleton className="h-3 w-24" />
							</div>
							<Skeleton className="h-3 w-16" />
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Monthly Activity Card */}
			<Card>
				<CardHeader>
					<div className="flex justify-between">
						<Skeleton className="h-5 w-32" />
						<Calendar className="size-4 text-muted-foreground/50" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div>
							<div className="flex items-center gap-2">
								<Skeleton className="h-8 w-24" />
								<Skeleton className="h-5 w-20" />
							</div>
							<div className="flex items-center gap-2 mt-1">
								<Skeleton className="size-4" />
								<Skeleton className="h-4 w-16" />
							</div>
						</div>
						<div className="space-y-1">
							<div className="flex justify-between text-sm">
								<Skeleton className="h-4 w-40" />
								<Skeleton className="h-4 w-10" />
							</div>
							<Skeleton className="h-2 w-full" />
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Peak Month Card */}
			<Card>
				<CardHeader>
					<div className="flex justify-between">
						<Skeleton className="h-5 w-24" />
						<TrendingUp className="size-4 text-muted-foreground/50" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div>
							<Skeleton className="h-8 w-28" />
							<div className="flex items-center gap-2 mt-1">
								<Skeleton className="size-4" />
								<Skeleton className="h-4 w-32" />
							</div>
						</div>
						<div className="flex flex-col gap-2">
							<div className="flex justify-between items-center">
								<Skeleton className="h-4 w-20" />
								<div className="flex items-center gap-1">
									<Skeleton className="h-4 w-16" />
									<Brain className="size-3 text-muted-foreground/30" />
								</div>
							</div>
							<div className="flex justify-between items-center">
								<Skeleton className="h-4 w-28" />
								<div className="flex items-center gap-1">
									<Skeleton className="h-4 w-16" />
									<Clock className="size-3 text-muted-foreground/30" />
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
