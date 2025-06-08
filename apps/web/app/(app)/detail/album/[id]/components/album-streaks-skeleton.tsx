import { Card, CardContent, CardHeader } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";

export function AlbumStreaksSkeleton() {
	return (
		<>
			<Card className="border-orange-400/30 dark:bg-background/80">
				<CardHeader>
					<Skeleton className="mb-2 h-5 w-40" />
				</CardHeader>
				<CardContent className="flex flex-row items-center justify-center gap-6 pt-4">
					<div className="flex flex-col items-center">
						<Skeleton className="mb-2 h-10 w-16" />
						<Skeleton className="h-3 w-20" />
					</div>
					<div className="flex flex-col items-center">
						<Skeleton className="mb-2 h-10 w-16" />
						<Skeleton className="h-3 w-20" />
					</div>
				</CardContent>
			</Card>
			<Card className="border-blue-400/30 dark:bg-background/80">
				<CardHeader>
					<Skeleton className="mb-2 h-5 w-40" />
				</CardHeader>
				<CardContent className="flex flex-row items-center justify-center gap-6 pt-4">
					<div className="flex flex-col items-center">
						<Skeleton className="mb-2 h-10 w-16" />
						<Skeleton className="h-3 w-20" />
					</div>
					<div className="flex flex-col items-center">
						<Skeleton className="mb-2 h-10 w-16" />
						<Skeleton className="h-3 w-20" />
					</div>
				</CardContent>
			</Card>
		</>
	);
}
