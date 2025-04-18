"use client";

import { Button } from "@repo/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/card";
import { ButtonGroup } from "@repo/ui/components/button-group";
import { MonthPicker } from "@repo/ui/components/monthpicker";
import { cn } from "@repo/ui/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { Separator } from "@repo/ui/separator";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, Music4 } from "lucide-react"; // Import Music4 icon
import React from "react";
import { MusicItemCard } from "~/components/cards/music-item-card";
import { msToMinutes } from "~/components/charts/utils/time-formatters";

import _ from "lodash";
import { TrendBadge } from "~/components/trend-badge";
import type { MonthlyTrackData } from "~/services/details/get-monthly-top-tracks";

interface MonthlyTopTracksProps {
	dataPromise: Promise<MonthlyTrackData[]>;
	artistNamePromise: Promise<string | undefined>;
}

export function MonthlyTopTracks({
	dataPromise,
	artistNamePromise,
}: MonthlyTopTracksProps) {
	const data = React.use(dataPromise);
	const artistName = React.use(artistNamePromise);
	const [date, setDate] = React.useState<Date | undefined>(
		data.length > 0 ? new Date(`${data[0].month}-01`) : undefined,
	);

	if (!data.length || !date) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Monthly Top Tracks</CardTitle>
					<CardDescription>
						No monthly listening data available for{" "}
						{artistName || "this artist"}.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
					<Music4 className="mb-2 size-8" />
					<p>Start listening to build your monthly stats!</p>
				</CardContent>
			</Card>
		);
	}

	const currentMonth =
		data.find((month) => month.month === format(date, "MMMM yyyy")) || data[0];
	const { month, tracks } = currentMonth;

	return (
		<div>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div className="space-y-1">
						<CardTitle>Top Tracks for {month}</CardTitle>
						<CardDescription>
							Your most played tracks by {artistName || "this artist"} during{" "}
							{month}.
						</CardDescription>
					</div>
					<MonthSelector
						date={date}
						setDate={setDate}
						minDate={new Date(`${data[data.length - 1].month}-01`)}
						maxDate={new Date(`${data[0].month}-01`)}
					/>
				</CardHeader>
				<CardContent className="flex flex-col p-4 pb-0">
					{tracks.length > 0 ? (
						tracks.map((track, index) => (
							<div key={track.id} className="flex flex-col">
								<MusicItemCard
									item={{
										href: track.spotifyUrl,
										id: track.id,
										name: track.name,
										image: track.image,
										artists: track.album,
										stat1: `${msToMinutes(track.msPlayed).toFixed(2)} min`,
										stat2: `${track.plays} plays`,
										description: (
											<TrendBadge
												trend={track.trend}
												previousRank={track.previousRank}
											/>
										),
									}}
									rank={index + 1}
								/>
								{index < tracks.length - 1 && <Separator />}
							</div>
						))
					) : (
						<div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
							<Music4 className="mb-2 size-8" />
							<p>
								No tracks played for {artistName || "this artist"} during{" "}
								{month}.
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

function MonthSelector({
	date,
	setDate,
	minDate,
	maxDate,
}: {
	date: Date;
	setDate: (date: Date) => void;
	minDate: Date;
	maxDate: Date;
}) {
	return (
		<ButtonGroup size="sm">
			<Button
				size="sm"
				variant="outline"
				onClick={() =>
					setDate(new Date(date.getFullYear(), date.getMonth() + 1))
				}
				disabled={_.gte(date.getTime(), maxDate.getTime())}
			>
				<ArrowLeft className="size-4" />
			</Button>
			<Popover>
				<PopoverTrigger asChild={true}>
					<Button
						size="sm"
						variant="outline"
						className={cn(
							"w-[86px] justify-start text-left font-normal",
							!date && "text-muted-foreground",
						)}
					>
						{format(date, "MMM yyyy")}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<MonthPicker
						onMonthSelect={setDate}
						selectedMonth={date}
						maxDate={maxDate}
						minDate={minDate}
					/>
				</PopoverContent>
			</Popover>
			<Button
				size="sm"
				variant="outline"
				onClick={() =>
					setDate(new Date(date.getFullYear(), date.getMonth() - 1))
				}
				disabled={_.lte(date.getTime(), minDate.getTime())}
			>
				<ArrowRight className="size-4" />
			</Button>
		</ButtonGroup>
	);
}
