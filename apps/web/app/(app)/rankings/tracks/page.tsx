import { Suspense } from "react";

import { AppHeader } from "~/components/app-header";
import { SelectMonthRange } from "~/components/select-month-range";

import { RankList } from "../components/ranking-list";

export default function RankingsTracksPage() {
  return (
    <>
      <AppHeader items={["Package", "Rankings", "Tracks"]}>
        <SelectMonthRange />
      </AppHeader>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Suspense fallback={<div>Loading...</div>}>
          <RankList type="tracks" />
        </Suspense>
      </div>
    </>
  );
}
