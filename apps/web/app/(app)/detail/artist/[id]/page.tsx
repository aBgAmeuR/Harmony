import { Suspense } from "react";

import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { ArtistHeader, ArtistHeaderSkeleton } from "~/features/detail/artist/components/artist-header";
import { CatalogTab } from "~/features/detail/artist/components/catalog-tab";
import { MonthlyTracksTab } from "~/features/detail/artist/components/monthly-tracks-tab";
import { StatsTab, StatsTabSkeleton } from "~/features/detail/artist/components/stats-tab";
import { DetailTabs, DetailTabsContent } from "~/features/detail/common/components/detail-tabs";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function DetailArtistPage({ params }: PageProps) {
	const { id } = await params;

	return (
		<Layout>
			<LayoutHeader items={["Detail", "Artist"]} />
			<LayoutContent className="px-0">
				<div className="mx-auto w-full max-w-7xl px-4">
					<Suspense fallback={<ArtistHeaderSkeleton />}>
						<ArtistHeader artistId={id} />
					</Suspense>
				</div>
				<DetailTabs tabs={["Statistics", "Monthly Tracks", "Catalog"]}>
					<DetailTabsContent value="Statistics">
						<Suspense fallback={<StatsTabSkeleton />}>
							<StatsTab artistId={id} />
						</Suspense>
					</DetailTabsContent>
					<DetailTabsContent value="Monthly Tracks">
						<Suspense>
							<MonthlyTracksTab artistId={id} />
						</Suspense>
					</DetailTabsContent>
					<DetailTabsContent value="Catalog">
						<Suspense>
							<CatalogTab artistId={id} />
						</Suspense>
					</DetailTabsContent>
				</DetailTabs>
			</LayoutContent>
		</Layout>
	);
}
