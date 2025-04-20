"use client";

import { Button } from "@repo/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@repo/ui/tooltip";
import { CalendarIcon } from "lucide-react";

import { useMounted } from "~/hooks/use-mounted";
import { useSelectMonthRange } from "~/hooks/use-select-month-range";

import { Skeleton } from "@repo/ui/skeleton";
import { MonthRangePicker, formatDate } from "./month-range-picker";

export const SelectMonthRange = () => {
	const isMounted = useMounted();
	const { isDemo, minMaxDateRange, monthRange, isError, mutate } =
		useSelectMonthRange();
	let selectedMonthRange = null;

	if (isDemo && !monthRange && !minMaxDateRange && !isError) {
		const date = new Date("2023-12-31T23:00:00.000Z");
		selectedMonthRange = {
			start: date,
			end: new Date(),
		};
	} else if (!isMounted || isError || !minMaxDateRange || !monthRange) {
		return null;
	} else {
		selectedMonthRange = {
			start: monthRange.dateStart,
			end: monthRange.dateEnd,
		};
	}

	if (isDemo) {
		const buttonLabel = selectedMonthRange
			? selectedMonthRange.start.getTime() === selectedMonthRange.end.getTime()
				? formatDate(selectedMonthRange.start)
				: `${formatDate(selectedMonthRange.start)} - ${formatDate(selectedMonthRange.end)}`
			: "Pick a month range";

		return (
			<TooltipProvider delayDuration={0}>
				<Tooltip>
					<TooltipTrigger className="cursor-not-allowed" asChild={true}>
						<span tabIndex={0}>
							<Button
								variant={"outline"}
								className="w-[220px] justify-start text-left font-normal"
								disabled={true}
							>
								<CalendarIcon className="mr-2 size-4" />
								{buttonLabel}
							</Button>
						</span>
					</TooltipTrigger>
					<TooltipContent side="bottom" className="px-2 py-1 text-xs">
						This feature is disabled in demo mode
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}

	return (
		<MonthRangePicker
			selectedMonthRange={selectedMonthRange}
			onMonthRangeSelect={mutate}
			minDate={minMaxDateRange?.minDate}
			maxDate={minMaxDateRange?.maxDate}
		/>
	);
};

export const SelectMonthRangeSkeleton = () => (
	<Skeleton className="h-9 w-[220px] rounded-md" />
);
