import { cn } from "@repo/ui/lib/utils";

type MusicItemCardRankProps = {
	rank: number;
	rankChange?: "up" | "down" | "new";
	className?: string;
	layout?: "list" | "grid";
};

export const MusicItemCardRank = ({
	rank,
	rankChange,
	className,
	layout = "list",
}: MusicItemCardRankProps) => (
	<span className={cn("flex w-6 flex-col items-center justify-center text-center font-medium text-muted-foreground text-sm", layout === "grid" ? "w-full items-start justify-start" : "w-6", className)}>
		{layout === "list" && (
			<span
				className={cn(
					"text-green-500 opacity-0 transition-opacity duration-300",
					rankChange === "up" && "opacity-100",
				)}
			>
				↑
			</span>
		)}
		<span className={cn(layout === "grid" && "rounded bg-black/70 px-1 py-0.5 text-white text-xs")}>
			{rankChange === "new" && layout === "list" ? <span className="text-blue-500">new</span> : rank}
		</span>
		{layout === "list" && (
			<span
				className={cn(
					"text-red-500 opacity-0 transition-opacity duration-300",
					rankChange === "down" && "opacity-100",
				)}
			>
				↓
			</span>
		)}
	</span>
);
