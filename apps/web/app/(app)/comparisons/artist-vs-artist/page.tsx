
import { Suspense } from "react";
import type { Metadata } from "next";

import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { ArtistSelector, ArtistSelectorSkeleton } from "~/features/comparisons/artist-vs-artist/components/artist-selector";
import { ComparisonArtistVsArtistContent } from "~/features/comparisons/artist-vs-artist/components/comparison-content";

export const metadata: Metadata = {
	title: "Artist vs Artist",
	description: "Compare your listening habits between two artists",
};

export default async function ArtistVsArtistPage() {
	return (
		<Layout>
			<LayoutHeader items={["Advanced", "Comparisons", "Artist vs Artist"]} metadata={metadata}>
				<Suspense fallback={<ArtistSelectorSkeleton />}>
					<ArtistSelector />
				</Suspense>
			</LayoutHeader>
			<LayoutContent>
				<ComparisonArtistVsArtistContent>
					<Suspense fallback={<ArtistSelectorSkeleton />}>
						<ArtistSelector showWhenEmpty={true} />
					</Suspense>
				</ComparisonArtistVsArtistContent>
			</LayoutContent>
		</Layout>
	);
}
