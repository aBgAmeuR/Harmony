import type { Metadata } from "next";

import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";
import { RecentlyPlayed } from "~/features/stats/components/recently-played";
import { SelectListLayout } from "~/features/stats/components/select-list-layout";

export const metadata: Metadata = {
	title: "Recently Played",
	description: "Discover your recently played tracks on Spotify",
};

export default async function RecentlyPlayedPage() {
	return (
		<Layout>
			<LayoutHeader items={["Stats", "Recently Played"]} metadata={metadata}>
				<SelectListLayout />
			</LayoutHeader>
			<LayoutContent>
				<RecentlyPlayed />
			</LayoutContent>
		</Layout>
	);
}
