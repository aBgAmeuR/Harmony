"use client";

import { Button } from "@repo/ui/button";
import { Skeleton } from "@repo/ui/skeleton";
import { ExternalLink } from "lucide-react";

export function ArtistHeaderSkeleton() {
	return (
		<div className="flex flex-col items-start gap-6 md:flex-row md:items-end">
			<Skeleton className="size-24 rounded-full shadow-lg md:size-32" />
			<div className="flex-1">
				<div className="mb-2 flex items-center gap-4">
					<Skeleton className="h-10 w-60" />
					<Button
						variant="outline"
						size="sm"
						className="h-8 opacity-50"
						disabled={true}
					>
						<span>Open in Spotify</span>
						<ExternalLink className="ml-2 size-3" />
					</Button>
				</div>
				<div className="mt-3 flex flex-wrap gap-6">
					<div>
						<p className="text-muted-foreground text-sm">Followers</p>
						<Skeleton className="mt-1 h-6 w-24" />
					</div>
					<div>
						<p className="text-muted-foreground text-sm">Total Time</p>
						<Skeleton className="mt-1 h-6 w-28" />
					</div>
					<div>
						<p className="text-muted-foreground text-sm">Total Plays</p>
						<Skeleton className="mt-1 h-6 w-20" />
					</div>
				</div>
			</div>
		</div>
	);
}
