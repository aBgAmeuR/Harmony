import { cn } from "@repo/ui/lib/utils";

type MusicItemCardRankProps = {
	rank: number;
	rankChange?: "up" | "down" | "new";
};

export const MusicItemCardRank = ({
	rank,
	rankChange,
}: MusicItemCardRankProps) => (
	<span className="flex w-6 flex-col items-center justify-center text-center font-medium text-muted-foreground text-sm">
		<span
			className={cn(
				"text-green-500 opacity-0 transition-opacity duration-300",
				rankChange === "up" && "opacity-100",
			)}
		>
			↑
		</span>
		<span>
			{rankChange === "new" ? <span className="text-blue-500">new</span> : rank}
		</span>
		<span
			className={cn(
				"text-red-500 opacity-0 transition-opacity duration-300",
				rankChange === "down" && "opacity-100",
			)}
		>
			↓
		</span>
	</span>
);
