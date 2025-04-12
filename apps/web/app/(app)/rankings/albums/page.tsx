import { Main } from "@repo/ui/components/main";
import React, { Suspense } from "react";

import { AppHeader } from "~/components/app-header";
import { ListSkeleton } from "~/components/list-skeleton";
import { MusicList } from "~/components/lists/music-list";
import { SelectMonthRange } from "~/components/select-month-range";

export default function RankingsAlbumsPage() {
  return (
    <>
      <AppHeader items={["Package", "Rankings", "Albums"]}>
        <SelectMonthRange />
      </AppHeader>
      <Main>
        <MusicList type="rankingAlbums" />
      </Main>
    </>
  );
}
