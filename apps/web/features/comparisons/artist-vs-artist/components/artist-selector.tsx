import { getUser } from "@repo/auth";
import { Skeleton } from "@repo/ui/skeleton";

import { getTopArtists } from "../data/top-artists";
import { ArtistSelectorClient } from "./artist-selector-client";

export const ArtistSelector = async () => {
    const { userId } = await getUser();

    const topArtists = await getTopArtists(userId);

    return <ArtistSelectorClient topArtists={topArtists} />;
};

export function ArtistSelectorSkeleton() {
    return <Skeleton className="h-9 w-[420px]" />;
} 