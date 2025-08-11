import { Info } from "lucide-react";

import { getUser } from "@repo/auth";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@repo/ui/carousel";
import { Separator } from "@repo/ui/separator";

import { MusicItemCard } from "~/components/cards/music-item-card";

import { getCatalogTabData } from "../data/catalog-tab";

type CatalogTabProps = {
	artistId: string;
};

export const CatalogTab = async ({ artistId }: CatalogTabProps) => {
	const { userId } = await getUser();
	const data = await getCatalogTabData(artistId, userId);

	return (
		<div className="flex flex-col gap-8">
			<Carousel opts={{ align: "start", skipSnaps: true, slidesToScroll: 3 }}>
				<div className="mb-4 flex items-center justify-between">
					<div className="flex flex-col">
						<h4>Your Top Tracks</h4>
						<p className="text-muted-foreground text-sm">
							Here are your most played tracks from this artist
						</p>
					</div>
					{data.tracks.length > 0 && (
						<div className="flex items-center gap-2">
							<CarouselPrevious className="relative top-0 left-0 translate-y-0" />
							<CarouselNext className="relative top-0 right-0 translate-y-0" />
						</div>
					)}
				</div>
				{data.tracks.length > 0 ? (
					<CarouselContent>
						{data.tracks.map((item, index) => (
							<CarouselItem
								key={`${item.id}-${index}`}
								className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/7 xl:basis-1/8"
							>
								<MusicItemCard
									item={item}
									rank={index + 1}
									layout="grid"
									showAction={false}
								/>
							</CarouselItem>
						))}
					</CarouselContent>
				) : (
					<Alert variant="info">
						<Info className="size-4" />
						<AlertTitle>No tracks found</AlertTitle>
						<AlertDescription>
							You haven't listened to any tracks from this artist during this
							period
						</AlertDescription>
					</Alert>
				)}
			</Carousel>
			<div>
				<div className="mb-4 flex flex-col">
					<h4>Top Albums</h4>
					<p className="text-muted-foreground text-sm">
						Here are your top albums from this artist
					</p>
				</div>
				<div className="flex flex-col">
					{data.albums.map((item, index) => (
						<div key={`${item.id}-${index}`}>
							<MusicItemCard item={item} rank={index + 1} showAction={false} />
							{index < data.albums.length - 1 && <Separator />}
						</div>
					))}
					{data.albums.length === 0 && (
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
		</div>
	);
};
