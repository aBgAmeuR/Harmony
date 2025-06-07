"use client";
import { Separator } from "@repo/ui/separator";
import { useMemo, useState } from "react";
import { MusicItemCard } from "~/components/cards/music-item-card";

interface AlbumTracklistProps {
	tracklist: Array<{
		id: string;
		name: string;
		href: string;
		image?: string;
		artists?: string;
		stat1?: string;
		stat2?: string;
		track_number?: number;
		explicit?: boolean;
	}>;
}

type SortKey = "index" | "minutes" | "streams";

export function AlbumTracklist({ tracklist }: AlbumTracklistProps) {
	const [sort, setSort] = useState<SortKey>("index");

	const sortedTracklist = useMemo(() => {
		if (sort === "index") {
			return [...tracklist].sort(
				(a, b) => (a.track_number ?? 0) - (b.track_number ?? 0),
			);
		}
		if (sort === "minutes") {
			return [...tracklist].sort((a, b) => {
				const minA = Number.parseInt(a.stat1?.split(" ")[0] ?? "0", 10);
				const minB = Number.parseInt(b.stat1?.split(" ")[0] ?? "0", 10);
				return minB - minA;
			});
		}
		if (sort === "streams") {
			return [...tracklist].sort((a, b) => {
				const sA = Number.parseInt(a.stat2?.split(" ")[0] ?? "0", 10);
				const sB = Number.parseInt(b.stat2?.split(" ")[0] ?? "0", 10);
				return sB - sA;
			});
		}
		return tracklist;
	}, [tracklist, sort]);

	if (!tracklist.length) {
		return (
			<div className="text-muted-foreground">
				No tracks found for this album.
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="mb-2 flex items-center gap-2">
				<span className="font-medium text-sm">Sort by:</span>
				<select
					className="rounded border px-2 py-1 text-sm"
					value={sort}
					onChange={(e) => setSort(e.target.value as SortKey)}
				>
					<option value="index">Track #</option>
					<option value="minutes">Minutes</option>
					<option value="streams">Streams</option>
				</select>
			</div>
			<div className="flex flex-col">
				{sortedTracklist.map((track, idx) => (
					<div key={track.id}>
						<MusicItemCard item={track} rank={idx + 1} />
						{idx < sortedTracklist.length - 1 && <Separator />}
					</div>
				))}
			</div>
		</div>
	);
}
