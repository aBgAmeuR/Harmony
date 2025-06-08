import { Card, CardContent, CardHeader } from "@repo/ui/card";
import { Skeleton } from "@repo/ui/skeleton";

export function AlbumStatsSkeleton() {
	return (
		<div className="space-y-6">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[...Array(4)].map((_, i) => (
					<Card key={i}>
						<CardHeader>
							<Skeleton className="mb-2 h-4 w-24" />
						</CardHeader>
						<CardContent>
							<Skeleton className="mb-2 h-[30px] w-20" />
							<Skeleton className="h-3 w-16" />
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
