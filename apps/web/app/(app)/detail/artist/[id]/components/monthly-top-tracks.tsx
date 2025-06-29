"use client";

import React from "react";
import { format } from "date-fns";
import _ from "lodash";
import { ArrowLeft, ArrowRight, Music4 } from "lucide-react";

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

import { MusicItemCard } from "~/components/cards/music-item-card";
import { TrackRaceChartComponent } from "~/components/charts/artist/track-race-chart";
import {
	ChartCard,
	ChartCardContent,
	ChartCardHeader,
	ChartCardHeaderContent,
} from "~/components/charts/utils/chart-card";
import { msToMinutes } from "~/components/charts/utils/time-formatters";
import { TrendBadge } from "~/components/trend-badge";
import type {
	ChartRace,
	MonthlyTrackData,
} from "~/services/details/get-monthly-top-tracks";

interface MonthlyTopTracksProps {
	dataPromise: Promise<{ results: MonthlyTrackData[]; chartRace: ChartRace }>;
}

export function MonthlyTopTracks({ dataPromise }: MonthlyTopTracksProps) {
	const { results: data, chartRace } = React.use(dataPromise);
	const artistName = "Artist Name";
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

	const { month, tracks } =
		data.find((month) => month.month === format(date, "MMMM yyyy")) || data[0];

	return (
		<div className="space-y-6">
			<ChartCard className="pb-0">
				<ChartCardHeader
					title={`Top Tracks for ${month}`}
					description={`Your most played tracks by ${artistName || "this artist"} during ${month}.`}
					showSeparator={true}
				>
					<ChartCardHeaderContent className="border-l-transparent">
						<MonthSelector
							date={date}
							setDate={setDate}
							minDate={new Date(`${data[data.length - 1].month}-01`)}
							maxDate={new Date(`${data[0].month}-01`)}
						/>
					</ChartCardHeaderContent>
				</ChartCardHeader>
				<ChartCardContent className="!p-0">
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
									className="pr-4"
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
				</ChartCardContent>
			</ChartCard>
			<TrackRaceChartComponent
				data={{
					series: chartRace,
					artistName,
				}}
				availableYears={Array.from(
					new Set(data.map((d) => new Date(`${d.month}-01`).getFullYear())),
				).sort((a, b) => b - a)}
				initialYear={new Date(`${data[0].month}-01`).getFullYear()}
				className="mt-6"
			/>
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
