import { Button } from "@repo/ui/button";
import { NumberFlow } from "@repo/ui/components/number";
import { Skeleton } from "@repo/ui/skeleton";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

import {
	getArtistDetails,
	getArtistStatsAction,
} from "~/actions/get-artist-stats-action";
import { Icons } from "~/components/icons";

type ArtistHeaderProps = {
	artistId: string;
	userId?: string;
};

export async function ArtistHeader({ artistId, userId }: ArtistHeaderProps) {
	const artist = await getArtistDetails(artistId);
	if (!artist) return notFound();

	return (
		<div className="flex flex-col items-start gap-6 md:flex-row md:items-end">
			<img
				src={artist.images[0]?.url || "/placeholder.svg"}
				alt={artist.name}
				className="size-24 rounded-full shadow-lg md:size-32"
			/>
			<div className="flex-1">
				<div className="mb-2 flex items-center gap-4">
					<h1 className="font-bold text-3xl md:text-4xl">{artist.name}</h1>
					<Button
						asChild={true}
						size="sm"
						className="bg-[#1DB954] text-white hover:bg-[#169c43]"
						aria-label="Ouvrir l'artiste dans Spotify"
					>
						<a
							href={artist.href}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 font-semibold"
						>
							<Icons.spotify className="size-4" />
							<span className="hidden sm:inline">Ouvrir</span>
							<ExternalLink className="size-3" />
						</a>
					</Button>
				</div>
				<div className="flex flex-wrap gap-6">
					<div>
						<p className="text-muted-foreground text-sm">Followers</p>
						<p className="font-semibold text-xl">
							<NumberFlow
								value={artist.followers.total}
								format={{ notation: "standard" }}
							/>
						</p>
					</div>
					<Suspense
						fallback={
							<>
								<div>
									<p className="text-muted-foreground text-sm">Total Time</p>
									<Skeleton className="mt-1 h-6 w-28" />
								</div>
								<div>
									<p className="text-muted-foreground text-sm">Total Plays</p>
									<Skeleton className="mt-1 h-6 w-20" />
								</div>
							</>
						}
					>
						<ArtistStats artistId={artistId} userId={userId} />
					</Suspense>
				</div>
			</div>
		</div>
	);
}

const ArtistStats = async ({ artistId, userId }: ArtistHeaderProps) => {
	const artistStats = await getArtistStatsAction(userId, artistId);
	if (!artistStats) return null;

	return (
		<>
			<div>
				<p className="text-muted-foreground text-sm">Total Time</p>
				<p className="font-semibold text-xl">
					<NumberFlow
						value={artistStats.totalMinutes}
						suffix=" minutes"
						format={{ notation: "standard" }}
					/>
				</p>
			</div>
			<div>
				<p className="text-muted-foreground text-sm">Total Plays</p>
				<p className="font-semibold text-xl">
					<NumberFlow
						value={artistStats.totalStreams}
						format={{ notation: "standard" }}
					/>
				</p>
			</div>
		</>
	);
};

export function ArtistHeaderSkeleton() {
	return (
		<div className="flex flex-col items-start gap-6 md:flex-row md:items-end">
			<Skeleton className="size-24 rounded-full shadow-lg md:size-32" />
			<div className="flex-1">
				<div className="mb-2 flex items-center gap-4">
					<Skeleton className="h-10 w-60" />
					<Button
						variant="outline"
						size="sm"
						className="h-8 opacity-50"
						disabled={true}
					>
						<span>Open in Spotify</span>
						<ExternalLink className="ml-2 size-3" />
					</Button>
				</div>
				<div className="mt-3 flex flex-wrap gap-6">
					<div>
						<p className="text-muted-foreground text-sm">Followers</p>
						<Skeleton className="mt-1 h-6 w-24" />
					</div>
					<div>
						<p className="text-muted-foreground text-sm">Total Time</p>
						<Skeleton className="mt-1 h-6 w-28" />
					</div>
					<div>
						<p className="text-muted-foreground text-sm">Total Plays</p>
						<Skeleton className="mt-1 h-6 w-20" />
					</div>
				</div>
			</div>
		</div>
	);
}
