"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/select";
import React from "react";
import { MusicItemCard } from "~/components/cards/music-item-card";

interface TrackWithStats {
	index: number;
	id: string;
	name: string;
	artists: string;
	image: string;
	msPlayed: number;
	plays: number;
	spotifyUrl: string;
}

export interface AlbumTracksProps {
	data: Promise<TrackWithStats[]>;
}

export function AlbumTracks({ data }: AlbumTracksProps) {
	const tracks = React.use(data);
	const [sort, setSort] = React.useState<"index" | "min" | "plays">("index");

	const sorted = React.useMemo(() => {
		if (sort === "index") return [...tracks].sort((a, b) => a.index - b.index);
		if (sort === "min")
			return [...tracks].sort((a, b) => b.msPlayed - a.msPlayed);
		if (sort === "plays") return [...tracks].sort((a, b) => b.plays - a.plays);
		return tracks;
	}, [tracks, sort]);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between gap-2">
				<div>
					<h2 className="font-bold text-xl">Album Tracks</h2>
					<p className="text-muted-foreground text-sm">
						Here are all the tracks from this album with your listening stats.
					</p>
				</div>
				<Select
					value={sort}
					onValueChange={(value) => setSort(value as "index" | "min" | "plays")}
				>
					<SelectTrigger className="w-[220px]" size="sm">
						<span>
							Sort by <SelectValue placeholder="Select a sort" />
						</span>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="index">Album order</SelectItem>
						<SelectItem value="min">Time listened</SelectItem>
						<SelectItem value="plays">Number of plays</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className="flex flex-col gap-2">
				{sorted.map((track, i) => (
					<MusicItemCard
						key={track.id}
						item={{
							href: track.spotifyUrl,
							id: track.id,
							name: track.name,
							image: track.image,
							artists: track.artists,
							stat1: `${(track.msPlayed / 60000).toFixed(0)} min`,
							stat2: `${track.plays} plays`,
						}}
						rank={i + 1}
					/>
				))}
			</div>
		</div>
	);
}
