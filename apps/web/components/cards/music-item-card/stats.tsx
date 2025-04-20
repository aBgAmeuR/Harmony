import { cn } from "@repo/ui/lib/utils";

type MusicItemCardStatsProps = {
	stat1?: string;
	stat2?: string;
	layout?: "grid" | "list";
};

export const MusicItemCardStats = ({
	stat1,
	stat2,
	layout,
}: MusicItemCardStatsProps) => (
	<div
		className={cn(
			layout === "list"
				? "@lg:flex hidden flex-col items-start space-y-1"
				: "flex w-full flex-row items-end justify-between",
		)}
	>
		<p className="text-muted-foreground text-sm">
			{layout === "grid" ? stat1?.replace(" minutes", "min") : stat1}
		</p>
		<p className="text-muted-foreground text-sm">
			{layout === "grid" ? stat2?.replace(" streams", "x") : stat2}
		</p>
	</div>
);
