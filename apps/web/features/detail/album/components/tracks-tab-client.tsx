"use client";

import { useMemo, useState } from "react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/select";

import { MusicItemCard } from "~/components/cards/music-item-card";

import type { getTracksTabData } from "../data/tracks-tab";

type TracksTabClientProps = {
	tracks: Awaited<ReturnType<typeof getTracksTabData>>;
};

export const TracksTabClient = ({ tracks }: TracksTabClientProps) => {
	const [sort, setSort] = useState<"index" | "min" | "plays">("index");

	const sorted = useMemo(() => {
		return tracks.sort((a, b) => {
			if (sort === "index") return a.index - b.index;
			if (sort === "min") return b.msPlayed - a.msPlayed;
			return b.plays - a.plays;
		});
	}, [tracks, sort]);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between gap-2">
				<div>
					<h4>Album Tracks</h4>
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
			<div className="flex flex-col">
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
};
