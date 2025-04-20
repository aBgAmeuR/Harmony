import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@repo/ui/carousel";
import { Info } from "lucide-react";

import { MusicItemCard } from "~/components/cards/music-item-card";

type Track = {
	id: string;
	href: string;
	image: string;
	name: string;
	artists: string;
	stat1: string;
	stat2: string;
};

type TrackListProps = {
	tracks: Track[];
};

export const TrackList = ({ tracks }: TrackListProps) => (
	<div>
		<Carousel
			opts={{
				align: "start",
				skipSnaps: true,
				slidesToScroll: 3,
			}}
		>
			<div className="mb-4 flex items-center justify-between">
				<div className="flex flex-col">
					<h2 className="font-bold text-xl">Your Top Tracks</h2>
					<p className="text-muted-foreground text-sm">
						Here are your most played tracks from this artist
					</p>
				</div>
				{tracks.length > 0 && (
					<div className="flex items-center gap-2">
						<CarouselPrevious className="relative top-0 left-0 translate-y-0" />
						<CarouselNext className="relative top-0 right-0 translate-y-0" />
					</div>
				)}
			</div>
			{tracks.length > 0 ? (
				<CarouselContent>
					{tracks.map((item, index) => (
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
	</div>
);
