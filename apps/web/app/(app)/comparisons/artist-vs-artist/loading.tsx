import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { ArtistSelectorSkeleton } from "~/features/comparisons/artist-vs-artist/components/artist-selector";

import { metadata } from "./page";

export { metadata };

export default async function Loading() {
    return (
        <Layout>
            <LayoutHeader items={["Advanced", "Comparisons", "Artist vs Artist"]} demo={false} metadata={metadata} />
            <LayoutContent>
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
                    <h2 className="font-bold text-2xl text-foreground">Compare Your Artists</h2>
                    <p className="max-w-md text-center text-muted-foreground">
                        Select two artists from your top listened to compare their listening statistics, including play time, streams, and more.
                    </p>
                    <ArtistSelectorSkeleton />
                </div>
            </LayoutContent>
        </Layout>
    );
}
