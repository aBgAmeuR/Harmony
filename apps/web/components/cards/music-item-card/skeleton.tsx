"use client";

import { AspectRatio } from "@repo/ui/aspect-ratio";
import { Skeleton } from "@repo/ui/skeleton";

const useRandomWidth = (index: number, min: number, max: number) => {
	const seed = index * 9973;
	const pseudoRandom = Math.abs(Math.sin(seed) * 10000) % 1;
	return Math.floor(min + pseudoRandom * (max - min));
};

type CardSkeletonProps = {
	showRank: boolean;
	index: number;
	layout?: "grid" | "list";
};

export const CardSkeleton = ({
	showRank,
	index,
	layout = "list",
}: CardSkeletonProps) => {
	const titleWidth = useRandomWidth(index, 50, 130);
	const subtitleWidth = useRandomWidth(index + 50, 50, 130);
	const largeTitleWidth = useRandomWidth(index + 100, 150, 350);
	const largeSubtitleWidth = useRandomWidth(index + 150, 150, 350);

	if (layout === "grid")
		return (
			<article className="flex h-full flex-col items-start space-y-2">
				<div className="relative w-full">
					<AspectRatio>
						<Skeleton className="aspect-square size-full cursor-pointer rounded-md object-cover" />
					</AspectRatio>
				</div>


				<div className="inline-flex w-full flex-col gap-1">
					<Skeleton className="h-4" style={{ maxWidth: `${titleWidth}px` }} />
					<Skeleton
						className="h-4"
						style={{ maxWidth: `${subtitleWidth}px` }}
					/>
				</div>
				<div className="flex w-full flex-row items-end justify-between">
					<Skeleton className="h-3 w-12" />
					<Skeleton className="h-3 w-8" />
				</div>
			</article>
		);

	return (
		<article className="flex items-center space-x-2 py-4 sm:space-x-4">
			{showRank && (
				<span className="flex w-6 flex-col items-center justify-center text-right font-medium text-muted-foreground text-sm">
					{index + 1}
				</span>
			)}
			<Skeleton className="aspect-square size-16 rounded-md object-cover" />
			<div className="flex-1 space-y-1">
				<Skeleton
					className="h-4"
					style={{ maxWidth: `${largeTitleWidth}px` }}
				/>
				<Skeleton
					className="h-4"
					style={{ maxWidth: `${largeSubtitleWidth}px` }}
				/>
			</div>
		</article>
	);
};
