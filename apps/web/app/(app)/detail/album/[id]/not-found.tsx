import { AlertTriangle } from "lucide-react";

import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";

export default function AlbumNotFound() {
	return (
		<Layout>
			<LayoutHeader items={["Detail", "Album"]} />
			<LayoutContent className="mx-auto w-full max-w-6xl items-center justify-center px-4 py-16">
				<AlertTriangle className="size-12 text-yellow-500" />
				<h2 className="font-semibold text-2xl">Album not found</h2>
				<p className="max-w-md text-center text-muted-foreground">
					We couldn't find this album. They might not be in your listening
					history, or there might be an issue with the Spotify API.
				</p>
			</LayoutContent>
		</Layout>
	);
}
