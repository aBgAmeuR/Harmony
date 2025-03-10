import { Suspense } from "react";

import { AppHeader } from "~/components/app-header";
import { ListSkeleton } from "~/components/list-skeleton";
import { MusicList } from "~/components/lists/music-list";
import { SelectTimeRange } from "~/components/select-time-range";
import { SelectTimeRangeInfo } from "~/components/select-time-range-info";

export default function TopArtistsPage() {
  return (
    <>
      <AppHeader items={["Stats", "Top", "Artists"]}>
        <SelectTimeRangeInfo />
        <SelectTimeRange />
        {/* // TODO: Enable this component when it's ready */}
        {/* <SelectTopLayout /> */}
      </AppHeader>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Suspense fallback={<ListSkeleton />}>
          <MusicList type="topArtists" />
        </Suspense>
      </div>
    </>
  );
}
