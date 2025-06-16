import { Button } from "@repo/ui/button";
import { NumberFlow } from "@repo/ui/components/number";
import { Skeleton } from "@repo/ui/skeleton";
import { ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

import { Icons } from "~/components/icons";
import {
	getAlbumDetails,
	getAlbumStats,
} from "~/services/details/get-album-details";

type AlbumHeaderProps = {
	albumId: string;
	userId?: string;
};

export async function AlbumHeader({ albumId, userId }: AlbumHeaderProps) {
	const album = await getAlbumDetails(albumId);
	if (!album) return notFound();

	return (
		<div className="flex flex-col items-start gap-6 md:flex-row md:items-end">
			<img
				src={album.images[0]?.url || "/placeholder.svg"}
				alt={album.name}
				className="size-32 rounded-md shadow-lg md:size-40"
			/>
			<div className="flex-1">
				<div className="mb-2 flex flex-col">
					<p className="text-lg text-muted-foreground">{album.artists[0].name}</p>
					<div className="flex items-center gap-4">
						<h1 className="font-bold text-3xl md:text-4xl">{album.name}</h1>
						<Button
							asChild={true}
							size="sm"
							className="bg-[#1DB954] text-white hover:bg-[#169c43]"
							aria-label="Open album in Spotify"
						>
							<a
								href={album.external_urls.spotify}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 font-semibold"
							>
								<Icons.spotify className="size-4" />
								<span className="hidden sm:inline">Open</span>
								<ExternalLink className="size-3" />
							</a>
						</Button>
					</div>
				</div>
				<div className="flex flex-wrap gap-6">
					<div>
						<p className="text-muted-foreground text-sm">Release Date</p>
						<p className="font-semibold text-xl">
							{new Date(album.release_date).toLocaleDateString("en-US", {
								day: "numeric",
								month: "long",
								year: "numeric",
							})}
						</p>
					</div>
					<div>
						<p className="text-muted-foreground text-sm">Total Tracks</p>
						<p className="font-semibold text-xl">{album.total_tracks}</p>
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
						<AlbumStats albumId={albumId} userId={userId} />
					</Suspense>
				</div>
			</div>
		</div>
	);
}

const AlbumStats = async ({ albumId, userId }: AlbumHeaderProps) => {
	const albumStats = await getAlbumStats(userId, albumId);
	if (!albumStats) return null;

	return (
		<>
			<div>
				<p className="text-muted-foreground text-sm">Total Time</p>
				<p className="font-semibold text-xl">
					<NumberFlow
						value={albumStats.totalMinutes}
						suffix=" minutes"
						format={{ notation: "standard" }}
					/>
				</p>
			</div>
			<div>
				<p className="text-muted-foreground text-sm">Total Plays</p>
				<p className="font-semibold text-xl">
					<NumberFlow
						value={albumStats.totalStreams}
						format={{ notation: "standard" }}
					/>
				</p>
			</div>
		</>
	);
};

export function AlbumHeaderSkeleton() {
	return (
		<div className="flex flex-col items-start gap-6 md:flex-row md:items-end">
			<Skeleton className="size-32 rounded-md shadow-lg md:size-48" />
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
						<p className="text-muted-foreground text-sm">Release Date</p>
						<Skeleton className="mt-1 h-6 w-24" />
					</div>
					<div>
						<p className="text-muted-foreground text-sm">Total Tracks</p>
						<Skeleton className="mt-1 h-6 w-20" />
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
