import { AspectRatio } from "@repo/ui/aspect-ratio";
import { cn } from "@repo/ui/lib/utils";

import { MusicItemCardAction as Action } from "./action";
import { MusicItemCardContent as Content } from "./content";
import { HistoricalRankings } from "./historical-rankings";
import { MusicItemCardImage as Image } from "./image";
import { MusicItemCardRank as Rank } from "./rank";
import { MusicItemCardStats as Stats } from "./stats";
import type { MusicItemCardProps as Props } from "./type";

export const ACTIONS_HREF = {
	rankingArtist: (id: string) => `/detail/artist/${id}?back=/rankings/artists`,
	rankingAlbum: (id: string) => `/detail/album/${id}?back=/rankings/albums`,
} as const;

export const MusicItemCard = ({
	item,
	rank,
	showAction,
	showHistoricalRankings,
	actionHref,
	layout = "list",
	className,
}: Props) => {
	return (
		<article
			className={cn(
				"@container flex",
				layout === "grid"
					? "group h-full flex-col items-start space-y-2"
					: "items-center space-x-2 py-4 sm:space-x-4",
				className,
			)}
		>
			{layout === "grid" ? (
				<>
					<div className="relative w-full">
						{rank && <Rank rank={rank} rankChange={item.rankChange} layout={layout} className="absolute top-2 left-2 z-10" />}
						{showAction && <Action href={actionHref ? ACTIONS_HREF[actionHref](item.id) : undefined} className="absolute top-2 right-2 z-10 hidden group-hover:flex" layout={layout} />}
						<AspectRatio>
							<Image
								src={item.image}
								alt={item.name}
								href={item.href}
								layout={layout}
							/>
						</AspectRatio>
					</div>
					<Content item={item} key={`${item.id}-content`} />
					<Stats stat1={item.stat1} stat2={item.stat2} layout={layout} />
				</>
			) : (
				<>
					{rank && <Rank rank={rank} rankChange={item.rankChange} />}
					<Image
						src={item.image}
						alt={item.name}
						href={item.href}
						layout={layout}
					/>
					<Content item={item} key={`${item.id}-content`} />
					{showHistoricalRankings && <HistoricalRankings item={item} />}
					<Stats stat1={item.stat1} stat2={item.stat2} layout={layout} />
					{showAction && <Action href={actionHref ? ACTIONS_HREF[actionHref](item.id) : undefined} layout={layout} />}
				</>
			)}
		</article>
	);
};
