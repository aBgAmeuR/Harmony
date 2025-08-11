import { format } from "date-fns";
import { notFound } from "next/navigation";

import { getUser } from "@repo/auth";

import {
	DetailHeader,
	DetailHeaderSkeleton,
	DetailHeaderStat,
	DetailHeaderStatSkeleton,
} from "../../common/components/detail-header";
import { getAlbumHeaderData } from "../data/album-header";

type AlbumHeaderProps = {
	albumId: string;
};

export const AlbumHeader = async ({ albumId }: AlbumHeaderProps) => {
	const { userId } = await getUser();
	const album = await getAlbumHeaderData(albumId, userId);
	if (!album) return notFound();

	return (
		<DetailHeader
			imgUrl={album.images[0]?.url}
			title={album.name || "Unknown Album"}
			subtitle={album.artists[0].name}
			hrefUrl={album.external_urls.spotify}
			imgRadius="rounded-md"
		>
			<DetailHeaderStat
				label="Release Date"
				value={format(new Date(album.release_date), "MMMM d, yyyy")}
			/>
			<DetailHeaderStat label="Total Tracks" value={album.tracks.total} />
		</DetailHeader>
	);
};

export const AlbumHeaderSkeleton = () => {
	return (
		<DetailHeaderSkeleton showSubtitle={true} imgRadius="rounded-md">
			<DetailHeaderStatSkeleton label="Release Date" />
			<DetailHeaderStatSkeleton label="Total Tracks" />
		</DetailHeaderSkeleton>
	);
};
