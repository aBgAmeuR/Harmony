"use client";

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
			<article className="flex flex-col items-start space-y-2 h-full">
				<Skeleton className="aspect-square size-full rounded-md object-cover cursor-pointer" />
				<div className="w-full inline-flex flex-col gap-1">
					<Skeleton className="h-4" style={{ maxWidth: `${titleWidth}px` }} />
					<Skeleton
						className="h-4"
						style={{ maxWidth: `${subtitleWidth}px` }}
					/>
				</div>
				<div className="flex flex-row items-end justify-between w-full">
					<Skeleton className="h-3 w-7" />
					<Skeleton className="h-3 w-5" />
					{/* <p className="text-sm text-muted-foreground">239.57min</p> */}
					{/* <p className="text-sm text-muted-foreground">65x</p> */}
				</div>
			</article>
		);

	return (
		<article className="flex items-center space-x-2 py-4 sm:space-x-4">
			{showRank && (
				<span className="w-6 text-right text-sm font-medium text-muted-foreground">
					{index + 1}
				</span>
			)}
			<Skeleton className="aspect-square rounded-md object-cover size-16" />
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
