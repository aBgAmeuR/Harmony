'use client';

import { useTimeRangeStore } from "@/lib/state";
import { Title } from "@mantine/core";
import Image from "next/image";
import { DetailCard } from "../../_components/detail-card";
import { ErrorList } from "../../_components/error-list";
import { SpotifyBtn } from "@/components/ui/spotify-btn";
import { ErrorDetail } from "../../_components/error-detail";
import { getTracks } from "@/lib/store";

const DetailsTrack = ({ id }: { id: string }) => {
  const { timeRange } = useTimeRangeStore()
  const track = getTracks(timeRange, id)[0]
  if (!track) return <ErrorDetail msg="Track not found" href="/ranking/tracks" />

  return (
    <>
      <section className="bg-secondary">
        <div className="px-4 py-8 mx-auto w-full max-w-4xl flex gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className='size-40 flex justify-center items-center object-cover overflow-hidden rounded-sm'>
              <Image src={track.image_url} alt={track.name} width={160} height={160} />
            </div>
            <Title order={1}>{track.name}</Title>
          </div>
          <SpotifyBtn href={track.href} />
        </div>
      </section>
      <section className="px-4 py-8 mx-auto w-full max-w-4xl grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Title order={3} className="mb-2">Artist</Title>
          <DetailCard title={track.artist.name} ms_played={track.artist.ms_played} total_played={track.artist.total_played} />
        </div>
        <div className="flex flex-col gap-2">
          <Title order={3} className="mb-2">Album</Title>
          <DetailCard title={track.album.name} ms_played={track.album.ms_played} total_played={track.album.total_played} />
        </div>
      </section>
    </>
  )
}

export default DetailsTrack;