import { Suspense } from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/card";
import { LinkButton } from "@repo/ui/components/link-button";

import { MusicListSkeleton } from "~/components/lists/music-list/skeleton";
import { RankingArtists } from "~/features/rankings/components/ranking-artists";
import type { getRankingArtistsData } from "~/features/rankings/data/ranking-artists";

type TopArtistsCardProps = {
	data?: Awaited<ReturnType<typeof getRankingArtistsData>>;
};

export const TopArtistsCard = async ({ data }: TopArtistsCardProps) => {
	return (
		<Card className="col-span-1 pb-2">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<div className="space-y-1.5">
					<CardTitle>Top Artists</CardTitle>
					<CardDescription>Top artists you've listened to</CardDescription>
				</div>
				<LinkButton
					href="/rankings/artists"
					rightArrow={true}
					variant="outline"
				>
					View All
				</LinkButton>
			</CardHeader>
			<CardContent>
				<Suspense fallback={<MusicListSkeleton length={5} />}>
					<RankingArtists
						data={data}
						limit={5}
						config={{ layout: "list" }}
					/>
				</Suspense>
			</CardContent>
		</Card>
	);
};
