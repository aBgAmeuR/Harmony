import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { Separator } from "@repo/ui/separator";
import { Info } from "lucide-react";

import { MusicItemCard } from "~/components/cards/music-item-card";

type AlbumListProps = {
  albums: Array<{
    id: string;
    href: string;
    image: string;
    name: string;
    artists: string;
    stat1: string;
    stat2: string;
  }>;
};

export const AlbumList = ({ albums }: AlbumListProps) => (
  <div>
    <div className="flex flex-col mb-4">
      <h2 className="text-xl font-bold">Top Albums</h2>
      <p className="text-sm text-muted-foreground">
        Here are your top albums from this artist
      </p>
    </div>
    <div className="flex flex-col">
      {albums.map((item, index) => (
        <div key={`${item.id}-${index}`}>
          <MusicItemCard item={item} rank={index + 1} showAction={false} />
          {index < albums.length - 1 && <Separator />}
        </div>
      ))}
      {albums.length === 0 && (
        <Alert variant="info">
          <Info className="size-4" />
          <AlertTitle>No albums found</AlertTitle>
          <AlertDescription>
            You haven't listened to any albums from this artist during this
            period
          </AlertDescription>
        </Alert>
      )}
    </div>
  </div>
);
