import React, { Suspense } from "react";

import { AppHeader } from "~/components/app-header";
import { ListSkeleton } from "~/components/list-skeleton";
import { MusicList } from "~/components/lists/music-list";
import { SelectMonthRange } from "~/components/select-month-range";

export default function RankingsArtistsPage() {
  return (
    <>
      <AppHeader items={["Package", "Rankings", "Artists"]}>
        <SelectMonthRange />
      </AppHeader>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Suspense fallback={<ListSkeleton />}>
          <MusicList type="rankingArtists" />
        </Suspense>
      </div>
    </>
  );
}
