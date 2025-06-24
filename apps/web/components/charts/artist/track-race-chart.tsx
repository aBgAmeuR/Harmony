"use client";

import {
	ChartRace,
	type ChartRaceSeries,
} from "@repo/ui/components/charts/chart-race";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/select";
import * as React from "react";
import {
	ChartCard,
	ChartCardContent,
	ChartCardHeader,
	ChartCardHeaderContent,
} from "../utils/chart-card";

interface TrackRaceChartComponentProps {
	data: { series: ChartRaceSeries[]; artistName?: string };
	availableYears: number[];
	initialYear: number;
	onYearChange?: (year: number) => void;
	className?: string;
}

export function TrackRaceChartComponent({
	data,
	availableYears,
	initialYear,
	onYearChange,
	className,
}: TrackRaceChartComponentProps) {
	const [rankYear, setRankYear] = React.useState(initialYear);
	// Filtrer les séries pour l'année sélectionnée
	const filteredSeries = React.useMemo(
		() =>
			data.series
				.map((series) => ({
					...series,
					data: series.data
						.filter((d) => new Date(`${d.month}-01`).getFullYear() === rankYear)
						.sort(
							(a, b) =>
								new Date(`${a.month}-01`).getTime() -
								new Date(`${b.month}-01`).getTime(),
						),
				}))
				.filter((series) => series.data.length > 0),
		[data.series, rankYear],
	);

	const handleYearChange = (value: string) => {
		const year = Number(value);
		setRankYear(year);
		onYearChange?.(year);
	};

	return (
		<ChartCard className={className}>
			<ChartCardHeader
				title={`Track Ranking Race for ${rankYear}`}
				description={`Your track ranking race for ${data.artistName || "this artist"} during ${rankYear}.`}
				showSeparator={true}
			>
				<ChartCardHeaderContent className="border-l-transparent">
					<YearSelect
						years={availableYears}
						selectedYear={rankYear}
						onChange={handleYearChange}
					/>
				</ChartCardHeaderContent>
			</ChartCardHeader>
			<ChartCardContent className="!pl-0">
				<ChartRace
					config={{}}
					series={filteredSeries}
					xAxisDataKey="month"
					yAxisDataKey="rank"
					yAxisDomain={[1, 5]}
					yAxisReversed={true}
					className="w-full 2xl:aspect-[10/4]"
				/>
			</ChartCardContent>
		</ChartCard>
	);
}

interface YearSelectProps {
	years: number[];
	selectedYear: number;
	onChange: (value: string) => void;
}

function YearSelect({ years, selectedYear, onChange }: YearSelectProps) {
	return (
		<Select defaultValue={selectedYear.toString()} onValueChange={onChange}>
			<SelectTrigger className="w-[86px]">
				<SelectValue placeholder="Year" />
			</SelectTrigger>
			<SelectContent>
				{years.map((year) => (
					<SelectItem key={year} value={year.toString()}>
						{year}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
