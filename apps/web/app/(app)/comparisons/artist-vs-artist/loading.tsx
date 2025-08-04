import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { ArtistSelectorSkeleton } from "~/features/comparisons/artist-vs-artist/components/artist-selector";
import { ComparisonArtistVsArtistContentSkeleton } from "~/features/comparisons/artist-vs-artist/components/comparison-content";

import { metadata } from "./page";

export { metadata };

export default async function Loading() {
    return (
        <Layout>
            <LayoutHeader items={["Advanced", "Comparisons", "Artist vs Artist"]} demo={false} metadata={metadata}>
                <ArtistSelectorSkeleton />
            </LayoutHeader>
            <LayoutContent>
                <ComparisonArtistVsArtistContentSkeleton />
            </LayoutContent>
        </Layout>
    );
}
