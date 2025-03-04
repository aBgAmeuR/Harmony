import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@repo/ui/carousel";
import { notFound } from "next/navigation";

import { CardSkeleton } from "~/components/cards/music-item-card/skeleton";
import { ListSkeleton } from "~/components/list-skeleton";
import { getArtistDetails } from "~/services/details/get-artist-details";

import { AlbumList } from "./album-list";
import { TrackList } from "./track-list";

type TracksAlbumListsProps = {
  sessionId?: string;
  artistId: string;
  limitTracks?: number;
  limitAlbums?: number;
  showAll?: boolean;
};

export const TracksAlbumLists = async ({
  sessionId,
  artistId,
  limitTracks,
  limitAlbums,
  showAll = false,
}: TracksAlbumListsProps) => {
  const artistData = await getArtistDetails(sessionId, artistId);
  if (!artistData) return notFound();

  const tracks = showAll
    ? artistData.tracks
    : artistData.tracks.slice(0, limitTracks);
  const albums = showAll
    ? artistData.albums
    : artistData.albums.slice(0, limitAlbums);

  return (
    <div className="flex flex-col gap-8">
      <TrackList tracks={tracks} />
      <AlbumList albums={albums} />
    </div>
  );
};

export const TracksAlbumsListsSkeleton = () => (
  <div className="flex flex-col gap-8">
    <Carousel
      opts={{
        align: "start",
        skipSnaps: true,
        slidesToScroll: 3,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">Your Top Tracks</h2>
          <p className="text-sm text-muted-foreground">
            Here are your top tracks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CarouselPrevious className="relative left-0 top-0 translate-y-0" />
          <CarouselNext className="relative right-0 top-0 translate-y-0" />
        </div>
      </div>
      <CarouselContent>
        {Array.from({ length: 10 }).map((_, index) => (
          <CarouselItem
            key={`item-${index}`}
            className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/7 xl:basis-1/8"
          >
            <CardSkeleton showRank={false} index={index} layout="grid" />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
    <div>
      <h2 className="text-xl font-bold">Top Albums</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Here are your top albums
      </p>
      <div className="flex flex-col">
        <ListSkeleton length={10} showRank />
      </div>
    </div>
  </div>
);
