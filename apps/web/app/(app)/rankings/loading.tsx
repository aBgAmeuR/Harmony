import { Main } from "@repo/ui/components/main";
import { AppHeader } from "~/components/app-header";
import { ListSkeleton } from "~/components/list-skeleton";
import { SelectMonthRangeSkeleton } from "~/components/select-month-range";

export default function Loading() {
  return (
    <>
      <AppHeader items={["Package", "Rankings"]} demo={false}>
        <SelectMonthRangeSkeleton />
      </AppHeader>
      <Main>
        <ListSkeleton />
      </Main>
    </>
  )
}