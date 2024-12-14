import { Suspense } from "react";

import { AppHeader } from "~/components/app-header";
import { ListSkeleton } from "~/components/list-skeleton";
import { SelectMonthRange } from "~/components/select-month-range";

import { RankList } from "../ranking-list";

export default function RankingsAlbumsPage() {
  return (
    <>
      <AppHeader items={["Package", "Rankings", "Albums"]}>
        <SelectMonthRange />
      </AppHeader>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Suspense fallback={<ListSkeleton />}>
          <RankList type="albums" />
        </Suspense>
      </div>
    </>
  );
}
