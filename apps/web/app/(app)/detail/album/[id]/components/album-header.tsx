import { spotify } from "@repo/spotify";
import { Button } from "@repo/ui/button";
import { Skeleton } from "@repo/ui/skeleton";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface AlbumHeaderProps {
	albumId: string;
	userId?: string;
}

export async function AlbumHeader({ albumId, userId }: AlbumHeaderProps) {
	const album = await spotify.albums.get(albumId);
	if (!album) return notFound();

	const formatReleaseDate = (date: string, precision: string) => {
		const dateObj = new Date(date);
		if (precision === "day") {
			return dateObj.toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		}
		if (precision === "month") {
			return dateObj.toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
			});
		}
		return dateObj.getFullYear().toString();
	};

	return (
		<div className="flex flex-col gap-6 md:flex-row md:items-end">
			<div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-lg shadow-xl md:h-60 md:w-60">
				{album.images[0] && (
					<Image
						src={album.images[0].url}
						alt={album.name || "Album cover"}
						fill={true}
						className="object-cover"
						priority={true}
					/>
				)}
			</div>

			<div className="flex flex-1 flex-col gap-3">
				<div>
					<p className="text-muted-foreground text-sm">
						{album.album_type.charAt(0).toUpperCase() +
							album.album_type.slice(1)}
					</p>
					<h1 className="mb-1 text-3xl font-bold md:text-4xl lg:text-5xl">
						{album.name}
					</h1>
					<div className="flex items-center gap-2 text-lg">
						<span>By</span>
						{album.artists.map((artist, index) => (
							<span key={artist.id}>
								<Link
									href={`/detail/artist/${artist.id}`}
									className="font-semibold hover:underline"
								>
									{artist.name}
								</Link>
								{index < album.artists.length - 1 && ", "}
							</span>
						))}
					</div>
				</div>

				<div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
					<span>
						{formatReleaseDate(
							album.release_date,
							album.release_date_precision,
						)}
					</span>
					<span>•</span>
					<span>{album.total_tracks} tracks</span>
					{album.label && (
						<>
							<span>•</span>
							<span>{album.label}</span>
						</>
					)}
					{album.genres?.length > 0 && (
						<>
							<span>•</span>
							<span>{album.genres.join(", ")}</span>
						</>
					)}
				</div>

				<div className="mt-2 flex items-center gap-4">

					<Button
						variant="outline"
						size="lg"
						className="rounded-full"
						asChild={true}
					>
						<a
							href={album.external_urls.spotify}
							target="_blank"
							rel="noopener noreferrer"
						>
							<ExternalLink className="mr-2 h-4 w-4" />
							Open in Spotify
						</a>
					</Button>

					{album.popularity && (
						<div className="ml-auto flex items-center gap-2">
							<span className="text-muted-foreground text-sm">Popularity</span>
							<span className="text-lg font-semibold">{album.popularity}%</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export function AlbumHeaderSkeleton() {
	return (
		<div className="flex flex-col gap-6 md:flex-row md:items-end">
			<Skeleton className="h-48 w-48 rounded-lg md:h-60 md:w-60" />
			<div className="flex flex-1 flex-col gap-3">
				<div>
					<Skeleton className="mb-2 h-4 w-20" />
					<Skeleton className="mb-1 h-10 w-64" />
					<Skeleton className="h-6 w-40" />
				</div>
				<div className="flex gap-4">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-4 w-24" />
				</div>
				<div className="mt-2 flex gap-4">
					<Skeleton className="h-10 w-32 rounded-full" />
					<Skeleton className="h-10 w-40 rounded-full" />
				</div>
			</div>
		</div>
	);
}

