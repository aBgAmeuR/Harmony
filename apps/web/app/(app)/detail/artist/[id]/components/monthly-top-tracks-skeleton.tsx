import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader } from "@repo/ui/card";
import { Separator } from "@repo/ui/separator";
import { Skeleton } from "@repo/ui/skeleton";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

export function MonthlyTopTracksSkeleton() {
	return (
		<div className="space-y-10">
			{/* Introduction skeleton */}
			<div className="mb-2">
				<div className="mb-2 flex items-center gap-2">
					<Skeleton className="size-5 rounded-full" />
					<Skeleton className="h-8 w-56" />
				</div>
				<Skeleton className="mb-1 h-4 w-full" />
				<Skeleton className="mb-4 h-4 w-5/6" />

				{/* Legend skeleton */}
				<div className="mt-4 flex flex-wrap gap-5">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="flex items-center gap-2">
							<Skeleton className="h-6 w-8 rounded-md" />
							<Skeleton className="h-4 w-24" />
						</div>
					))}
				</div>
			</div>

			{/* Pagination controls skeleton */}
			<div className="flex items-center justify-between">
				<Button
					variant="outline"
					size="sm"
					disabled={true}
					className="flex items-center gap-1"
				>
					<ChevronLeft className="size-4" />
					<span>Previous month</span>
				</Button>

				<div className="text-center">
					<Badge variant="secondary" className="px-3 py-1 font-medium">
						<Skeleton className="h-4 w-16 bg-primary/20" />
					</Badge>
				</div>

				<Button
					variant="outline"
					size="sm"
					disabled={true}
					className="flex items-center gap-1"
				>
					<span>Next month</span>
					<ChevronRight className="size-4" />
				</Button>
			</div>

			{/* Current month card skeleton */}
			<Card className="overflow-hidden">
				<CardHeader className="bg-muted/30">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-4 w-16" />
						</div>
						<CalendarDays className="size-4 text-muted-foreground" />
					</div>
				</CardHeader>
				<CardContent className="p-0">
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i}>
							<div className="flex items-center gap-3 p-4">
								{/* Rank number */}
								<div className="flex w-8 items-center justify-center font-semibold text-muted-foreground text-xl">
									{i + 1}
								</div>

								{/* Trend indicator skeleton */}
								<Skeleton className="size-8 rounded-md" />

								{/* Album image skeleton */}
								<Skeleton className="size-12 rounded-md" />

								{/* Track info skeleton */}
								<div className="min-w-0 flex-1">
									<Skeleton className="mb-1 h-5 w-40" />
									<Skeleton className="mb-1 h-4 w-32" />
									<div className="flex gap-4">
										<Skeleton className="h-4 w-20" />
										<Skeleton className="h-4 w-20" />
										<Skeleton className="h-4 w-24" />
									</div>
								</div>

								{/* Action button skeleton */}
								<Skeleton className="ml-auto size-8 rounded-md" />
							</div>
							{i < 4 && <Separator />}
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
