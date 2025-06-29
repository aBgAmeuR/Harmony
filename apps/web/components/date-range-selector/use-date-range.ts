import { useState } from "react";

import { DateUtils } from "~/lib/date-utils";

const PRESETS = [
	{ label: "All Time", value: "all-time", description: "Complete history" },
	{ label: "This Year", value: "this-year", description: "Current year data" },
	{ label: "Last Year", value: "last-year", description: "Previous year data" },
	{ label: "Custom", value: "custom", description: "Select specific dates" },
] as const;

export type PresetType = (typeof PRESETS)[number]["value"];

type useDateRangeProps = {
	dateRange: { dateStart: Date; dateEnd: Date };
	minMaxDateRange?: { minDate: Date; maxDate: Date };
};

const getPreset = (
	dateRange: { from: Date; to: Date },
	minMaxDateRange?: { minDate: Date; maxDate: Date },
) => {
	const now = new Date();
	const currentYear = now.getFullYear();

	const isSameDay = (date1: Date, date2: Date) => {
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		);
	};

	if (
		minMaxDateRange &&
		dateRange.from.getTime() === minMaxDateRange.minDate.getTime() &&
		dateRange.to.getTime() === minMaxDateRange.maxDate.getTime()
	) {
		return PRESETS[0].value;
	}

	const thisYearStart = DateUtils.getFirstDayOfMonth(currentYear, 0);
	if (
		dateRange.from.getTime() === thisYearStart.getTime() &&
		isSameDay(dateRange.to, now)
	) {
		return PRESETS[1].value;
	}

	const lastYearStart = DateUtils.getFirstDayOfMonth(currentYear - 1, 0);
	const lastYearEnd = DateUtils.getLastDayOfMonth(currentYear - 1, 11);
	if (
		dateRange.from.getTime() === lastYearStart.getTime() &&
		dateRange.to.getTime() === lastYearEnd.getTime()
	) {
		return PRESETS[2].value;
	}

	return PRESETS[3].value;
};

const getDateRange = (
	preset: PresetType,
	selectedRange: { from: Date; to: Date },
	minMaxDateRange?: { minDate: Date; maxDate: Date },
) => {
	const now = new Date();
	const currentYear = now.getFullYear();

	if (preset === "all-time") {
		return {
			from: minMaxDateRange?.minDate ?? DateUtils.getFirstDayOfMonth(2015, 0),
			to: minMaxDateRange?.maxDate ?? now,
		};
	} else if (preset === "this-year") {
		return {
			from: DateUtils.getFirstDayOfMonth(currentYear, 0),
			to: now,
		};
	} else if (preset === "last-year") {
		return {
			from: DateUtils.getFirstDayOfMonth(currentYear - 1, 0),
			to: DateUtils.getLastDayOfMonth(currentYear - 1, 11),
		};
	} else {
		const sixMonthsAgo = new Date(now);
		sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

		return {
			from: selectedRange.from,
			to: selectedRange.to,
		};
	}
};

export const useDateRange = ({
	dateRange,
	minMaxDateRange,
}: useDateRangeProps) => {
	const [selectedRange, setSelectedRange] = useState({
		from: dateRange.dateStart,
		to: dateRange.dateEnd,
	});
	const [preset, setPreset] = useState<PresetType | null>(
		getPreset(selectedRange, minMaxDateRange),
	);

	const selectedDateRange = getDateRange(
		preset ?? "all-time",
		selectedRange,
		minMaxDateRange,
	);

	return {
		selectedDateRange,
		preset,
		selectedRange,
		setSelectedRange,
		setPreset,
		PRESETS,
	};
};
