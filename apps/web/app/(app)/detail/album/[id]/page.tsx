import { Suspense } from "react";

import {
	Layout,
	LayoutContent,
	LayoutHeader,
} from "~/components/layouts/layout";
import {
	AlbumHeader,
	AlbumHeaderSkeleton,
} from "~/features/detail/album/components/album-header";
import { ListeningTab } from "~/features/detail/album/components/listening-tab";
import {
	StatsTab,
	StatsTabSkeleton,
} from "~/features/detail/album/components/stats-tab";
import { TracksTab } from "~/features/detail/album/components/tracks-tab";
import {
	DetailTabs,
	DetailTabsContent,
} from "~/features/detail/common/components/detail-tabs";
import { getUserInfos } from "~/lib/utils-server";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function DetailAlbumPage({ params }: PageProps) {
	const { id } = await params;
	const { userId } = await getUserInfos();

	return (
		<Layout>
			<LayoutHeader items={["Detail", "Album"]} />
			<LayoutContent className="px-0">
				<div className="mx-auto w-full max-w-7xl px-4">
					<Suspense fallback={<AlbumHeaderSkeleton />}>
						<AlbumHeader albumId={id} userId={userId} />
					</Suspense>
				</div>
				<DetailTabs tabs={["Statistics", "Tracks", "Listening Trends"]}>
					<DetailTabsContent value="Statistics">
						<Suspense fallback={<StatsTabSkeleton />}>
							<StatsTab albumId={id} userId={userId} />
						</Suspense>
					</DetailTabsContent>
					<DetailTabsContent value="Tracks">
						<Suspense>
							<TracksTab albumId={id} userId={userId} />
						</Suspense>
					</DetailTabsContent>
					<DetailTabsContent value="Listening Trends">
						<Suspense>
							<ListeningTab albumId={id} userId={userId} />
						</Suspense>
					</DetailTabsContent>
				</DetailTabs>
			</LayoutContent>
		</Layout>
	);
}
