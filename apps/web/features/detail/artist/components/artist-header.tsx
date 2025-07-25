import { notFound } from "next/navigation";

import { getUser } from "@repo/auth";

import {
	DetailHeader,
	DetailHeaderSkeleton,
	DetailHeaderStat,
	DetailHeaderStatSkeleton,
} from "../../common/components/detail-header";
import { getArtistHeaderData } from "../data/artist-header";

type ArtistHeaderProps = {
	artistId: string;
};

export const ArtistHeader = async ({ artistId }: ArtistHeaderProps) => {
	const { userId } = await getUser();
	const artist = await getArtistHeaderData(artistId, userId);
	if (!artist || !artist.artist) return notFound();

	return (
		<DetailHeader
			imgUrl={artist.artist.images[0]?.url}
			title={artist.artist.name || "Unknown Artist"}
			hrefUrl={artist.artist.external_urls.spotify}
			imgRadius="rounded-full"
		>
			<DetailHeaderStat
				label="Followers"
				value={artist.artist.followers.total}
			/>
			<DetailHeaderStat label="Total Time" value={artist.totalMinutes} />
			<DetailHeaderStat label="Total Plays" value={artist.totalStreams} />
		</DetailHeader>
	);
};

export const ArtistHeaderSkeleton = () => {
	return (
		<DetailHeaderSkeleton imgRadius="rounded-full">
			<DetailHeaderStatSkeleton label="Followers" />
			<DetailHeaderStatSkeleton label="Total Time" />
			<DetailHeaderStatSkeleton label="Total Plays" />
		</DetailHeaderSkeleton>
	);
};
