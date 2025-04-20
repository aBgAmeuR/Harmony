import { Main } from "@repo/ui/components/main";
import { AppHeader } from "~/components/app-header";
import { ListSkeleton } from "~/components/list-skeleton";

export default function Loading() {
	return (
		<>
			<AppHeader items={["Stats", "Recently Played"]} demo={false} />
			<Main>
				<ListSkeleton showRank={false} />
			</Main>
		</>
	);
}
