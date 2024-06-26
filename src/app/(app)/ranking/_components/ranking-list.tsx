'use client';

import { RankingCard } from "./ranking-card";
import { getRankingData } from "@/lib/store";
import { getHref } from "@/lib/utils";
import { Title } from "@mantine/core";
import { ErrorList } from "./error-list";
import { useTimeRangeStore } from "@/lib/state";
import { useMediaQuery } from "@mantine/hooks";

type RankingListProps = {
  type: 'artists' | 'albums' | 'tracks'
}

const RankingList = ({ type }: RankingListProps) => {
  const { timeRange } = useTimeRangeStore()
  const isMobile = useMediaQuery(`(max-width: 640px)`)
  const data = getRankingData(type, timeRange)
  if (!Array.isArray(data)) return <ErrorList />

  return (
    <div className="px-4 mx-auto w-full max-w-4xl flex flex-col gap-2 mt-4 mb-32 md:my-8">
      {data.map((item, index) => (
        <div className='flex items-center w-full' key={index}>
          <Title order={isMobile ? 3 : 1} className='w-14 sm:w-24 text-center'>{`#${index + 1}`}</Title>
          <RankingCard
            title={item.name}
            subtitle={type !== 'artists' && 'artist' in item ? item.artist.name : undefined}
            image_url={item.image_url}
            ms_played={item.ms_played}
            total_played={item.total_played}
            href={getHref(item.spotify_uri, type)}
            image_variant={type === 'artists' ? 'circle' : 'rounded'}
          />
        </div>
      ))}
    </div>
  )
}

export default RankingList;