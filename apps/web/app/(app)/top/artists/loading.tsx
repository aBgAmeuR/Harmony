import { Main } from "@repo/ui/components/main";
import { AppHeader } from "~/components/app-header";
import { ListSkeleton } from "~/components/list-skeleton";
import { SelectTimeRangeSkeleton } from "~/components/select-time-range";

export default function Loading() {
  return (
    <>
      <AppHeader items={["Stats", "Top", "Artists"]} demo={false}>
        <SelectTimeRangeSkeleton />
      </AppHeader>
      <Main>
        <ListSkeleton />
      </Main>
    </>
  )
}