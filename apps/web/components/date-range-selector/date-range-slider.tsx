"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@repo/ui/lib/utils";
import { Skeleton } from "@repo/ui/skeleton";
import { Slider } from "@repo/ui/slider";

import { DateUtils } from "~/lib/date-utils";

import { getDateRangeSliderDataAction } from "./date-range-actions";

type DateRangeSliderProps = {
	selectedDateRange: { from: Date; to: Date };
	setDateRange: (range: { from: Date; to: Date }) => void;
};

export const DateRangeSlider = ({
	selectedDateRange,
	setDateRange,
}: DateRangeSliderProps) => {
	const { data, isLoading } = useQuery({
		queryKey: ["date-range-slider-data"],
		queryFn: getDateRangeSliderDataAction,
		staleTime: Number.POSITIVE_INFINITY,
		gcTime: 1000 * 60 * 60 * 24,
	});

	const findClosestIndex = useCallback(
		(date: Date) => {
			if (!data || data.length === 0) return 0;
			let closest = 0;
			let minDiff = Math.abs(data[0].date.getTime() - date?.getTime() || 0);

			for (let i = 1; i < data.length; i++) {
				const diff = Math.abs(data[i].date.getTime() - date?.getTime() || 0);
				if (diff < minDiff) {
					minDiff = diff;
					closest = i;
				}
			}
			return closest;
		},
		[data],
	);

	const [sliderValue, setSliderValue] = useState<number[]>([
		findClosestIndex(selectedDateRange.from),
		findClosestIndex(selectedDateRange.to),
	]);

	useEffect(() => {
		setSliderValue([
			findClosestIndex(selectedDateRange.from),
			findClosestIndex(selectedDateRange.to),
		]);
	}, [selectedDateRange, findClosestIndex]);

	if (isLoading) return (
		<div>
			<div className="flex h-12 w-full items-end px-3" aria-hidden="true">
				{new Array(32).fill(0).map((_, i) => (
					<div
						key={i}
						className="flex flex-1 justify-center"
						style={{ height: `${Math.random() * 100}%` }}
					>
						<Skeleton className="size-full rounded-none" />
					</div>
				))}
			</div>
			<Slider
				value={[0, 100]}
				max={32}
				min={0}
				disabled={true}
			/>
		</div>
	)

	if (!data || data.length === 0) return null;

	const maxCount = Math.max(...data.map((item) => item.value));

	return (
		<div>
			<div className="flex h-12 w-full items-end px-3" aria-hidden="true">
				{data.map((item, i) => (
					<div
						key={i}
						className="flex flex-1 justify-center"
						style={{ height: `${(item.value / maxCount) * 100}%` }}
					>
						<span
							className={cn(
								"size-full bg-primary/20",
								DateUtils.isDateInRange(
									item.date,
									data[sliderValue[0]].date,
									data[sliderValue[1]]?.date,
								) && "bg-primary/50",
							)}
						/>
					</div>
				))}
			</div>
			<Slider
				value={sliderValue}
				max={data.length - 1}
				min={0}
				onValueChange={(value) =>
					setDateRange({ from: data[value[0]].date, to: data[value[1]].date })
				}
				aria-label="Date range"
			/>
		</div>
	);
};
