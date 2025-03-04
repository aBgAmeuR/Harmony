import { AlertTriangle } from "lucide-react";

import { AppHeader } from "~/components/app-header";

export default function ArtistNotFound() {
  return (
    <>
      <AppHeader items={["Detail", "Artist", "Not Found"]} />
      <div className="flex flex-col items-center justify-center px-4 py-16 max-w-6xl w-full mx-auto">
        <AlertTriangle className="size-12 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Artist not found</h2>
        <p className="text-muted-foreground text-center max-w-md">
          We couldn't find this artist. They might not be in your listening
          history, or there might be an issue with the Spotify API.
        </p>
      </div>
    </>
  );
}
