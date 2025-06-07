import { DaysHabitChartComponent } from "~/components/charts/habits/days-habit-chart";
import { HoursHabitChartComponent } from "~/components/charts/habits/hours-habit-chart";

interface AlbumChartsProps {
	hoursData: { hour: string; msPlayed: number }[];
	daysData: { day: string; msPlayed: number }[];
}

export function AlbumCharts({ hoursData, daysData }: AlbumChartsProps) {
	return (
		<div className="grid gap-8 md:grid-cols-2">
			<HoursHabitChartComponent data={Promise.resolve(hoursData)} />
			<DaysHabitChartComponent data={Promise.resolve(daysData)} />
		</div>
	);
}
