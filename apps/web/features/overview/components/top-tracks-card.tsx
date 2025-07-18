import { Suspense } from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/card";
import { LinkButton } from "@repo/ui/components/link-button";

import { ListSkeleton } from "~/components/list-skeleton";
import { RankingTracks } from "~/features/rankings/components/ranking-tracks";
import type { getRankingTracksData } from "~/features/rankings/data/ranking-tracks";

type TopTracksCardProps = {
	data?: Awaited<ReturnType<typeof getRankingTracksData>>;
	userId: string;
	isDemo: boolean;
};

export const TopTracksCard = async ({
	data,
	userId,
	isDemo,
}: TopTracksCardProps) => {
	return (
		<Card className="col-span-1 pb-2">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<div className="space-y-1.5">
					<CardTitle>Top Tracks</CardTitle>
					<CardDescription>Top tracks you've listened to</CardDescription>
				</div>
				<LinkButton href="/rankings/tracks" rightArrow={true} variant="outline">
					View All
				</LinkButton>
			</CardHeader>
			<CardContent>
				<Suspense fallback={<ListSkeleton length={5} />}>
					<RankingTracks
						data={data}
						userId={userId}
						isDemo={isDemo}
						limit={5}
						config={{ layout: "list" }}
					/>
				</Suspense>
			</CardContent>
		</Card>
	);
};
