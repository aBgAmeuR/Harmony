import { AlertTriangle } from "lucide-react";

import { AppHeader } from "~/components/app-header";

export default function ArtistNotFound() {
	return (
		<>
			<AppHeader items={["Detail", "Artist", "Not Found"]} />
			<div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-4 py-16">
				<AlertTriangle className="mb-4 size-12 text-yellow-500" />
				<h2 className="mb-2 font-semibold text-2xl">Artist not found</h2>
				<p className="max-w-md text-center text-muted-foreground">
					We couldn't find this artist. They might not be in your listening
					history, or there might be an issue with the Spotify API.
				</p>
			</div>
		</>
	);
}
