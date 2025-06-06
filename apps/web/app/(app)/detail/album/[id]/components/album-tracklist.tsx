"use client";

import type { TrackSimplified } from "@repo/spotify/types";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/card";
import { ScrollArea } from "@repo/ui/scroll-area";
import { Skeleton } from "@repo/ui/skeleton";
import { Clock, Music } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AlbumTracklistProps {
	albumId: string;
	userId?: string;
}

// Mock function to get album tracks
async function getAlbumTracks(albumId: string): Promise<TrackSimplified[]> {
	// TODO: Implement proper API call
	// For now, return mock data
	return Array.from({ length: 12 }, (_, i) => ({
		id: `track-${i + 1}`,
		name: `Track ${i + 1}`,
		track_number: i + 1,
		disc_number: 1,
		duration_ms: Math.floor(Math.random() * 240000) + 120000, // 2-6 minutes
		artists: [
			{
				id: "artist-1",
				name: "Artist Name",
				uri: "",
				href: "",
				type: "artist",
				external_urls: { spotify: "" },
			},
		],
		explicit: Math.random() > 0.8,
		is_playable: true,
		preview_url: null,
		type: "track",
		uri: `spotify:track:${i + 1}`,
		href: "",
		external_urls: { spotify: "" },
		available_markets: [],
		linked_from: undefined,
		restrictions: undefined,
		is_local: false,
	})) as TrackSimplified[];
}

function formatDuration(ms: number): string {
	const minutes = Math.floor(ms / 60000);
	const seconds = Math.floor((ms % 60000) / 1000);
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function AlbumTracklist({ albumId, userId }: AlbumTracklistProps) {
	const [tracks, setTracks] = useState<TrackSimplified[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getAlbumTracks(albumId).then((data) => {
			setTracks(data);
			setLoading(false);
		});
	}, [albumId]);

	const totalDuration = tracks.reduce(
		(acc, track) => acc + track.duration_ms,
		0,
	);
	const totalTracks = tracks.length;

	if (loading) {
		return <TracklistSkeleton />;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Music className="h-5 w-5" />
					Tracklist
				</CardTitle>
				<CardDescription>
					{totalTracks} tracks • {formatDuration(totalDuration)} total duration
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[600px] pr-4">
					<div className="space-y-1">
						{tracks.map((track, index) => (
							<div
								key={track.id}
								className="group flex items-center justify-between rounded-lg p-3 hover:bg-muted/50 transition-colors"
							>
								<div className="flex items-start gap-4">
									<span className="text-center text-muted-foreground text-sm w-8">
										{track.track_number}
									</span>
									<div className="flex-1">
										<h4 className="font-medium">
											{track.name}
											{track.explicit && (
												<span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs">
													E
												</span>
											)}
										</h4>
										<p className="text-muted-foreground text-sm">
											{track.artists.map((artist, idx) => (
												<span key={artist.id}>
													<Link
														href={`/detail/artist/${artist.id}`}
														className="hover:underline"
													>
														{artist.name}
													</Link>
													{idx < track.artists.length - 1 && ", "}
												</span>
											))}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-4">
									<span className="text-muted-foreground text-sm">
										{formatDuration(track.duration_ms)}
									</span>
								</div>
							</div>
						))}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}

function TracklistSkeleton() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="h-6 w-32" />
				<Skeleton className="h-4 w-48" />
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					{Array.from({ length: 10 }).map((_, i) => (
						<div key={i} className="flex items-center justify-between p-3">
							<div className="flex items-center gap-4">
								<Skeleton className="h-4 w-8" />
								<div className="space-y-2">
									<Skeleton className="h-4 w-48" />
									<Skeleton className="h-3 w-32" />
								</div>
							</div>
							<Skeleton className="h-4 w-12" />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
