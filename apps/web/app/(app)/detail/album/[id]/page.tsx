import { Suspense } from "react";
import type { Metadata } from "next";

import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { AlbumHeader, AlbumHeaderSkeleton } from "~/features/detail/album/components/album-header";
import { ListeningTab } from "~/features/detail/album/components/listening-tab";
import { StatsTab, StatsTabSkeleton } from "~/features/detail/album/components/stats-tab";
import { TracksTab } from "~/features/detail/album/components/tracks-tab";
import { DetailTabs, DetailTabsContent } from "~/features/detail/common/components/detail-tabs";

export const metadata: Metadata = {
	title: "Album Details",
	description: "View detailed statistics, trends, and track information for this album.",
};

type PageProps = {
	params: Promise<{ id: string }>;
};

export default async function DetailAlbumPage({ params }: PageProps) {
	const { id } = await params;

	return (
		<Layout>
			<LayoutHeader items={["Detail", "Album"]} />
			<LayoutContent className="px-0">
				<div className="mx-auto w-full max-w-7xl px-4">
					<Suspense fallback={<AlbumHeaderSkeleton />}>
						<AlbumHeader albumId={id} />
					</Suspense>
				</div>
				<DetailTabs tabs={["Statistics", "Tracks", "Listening Trends"]}>
					<DetailTabsContent value="Statistics">
						<Suspense fallback={<StatsTabSkeleton />}>
							<StatsTab albumId={id} />
						</Suspense>
					</DetailTabsContent>
					<DetailTabsContent value="Tracks">
						<Suspense>
							<TracksTab albumId={id} />
						</Suspense>
					</DetailTabsContent>
					<DetailTabsContent value="Listening Trends">
						<Suspense>
							<ListeningTab albumId={id} />
						</Suspense>
					</DetailTabsContent>
				</DetailTabs>
			</LayoutContent>
		</Layout>
	);
}
