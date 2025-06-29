import { format, localeFormat } from "light-date";

type FormatDateOptions =
	| "full"
	| "short"
	| "month-year"
	| "month-year-short"
	| "month-short"
	| "month"
	| "year";

const formatDate = (date: Date, options: FormatDateOptions): string => {
	switch (options) {
		case "full":
			return `${localeFormat(date, "{MMMM}")} ${format(date, "{d},{yyyy}")}`;
		case "short":
			return `${localeFormat(date, "{MMM}")} ${format(date, "{d},{yyyy}")}`;
		case "month-year":
			return `${localeFormat(date, "{MMMM}")} ${format(date, "{yyyy}")}`;
		case "month-year-short":
			return `${localeFormat(date, "{MMM}")} ${format(date, "{yyyy}")}`;
		case "month-short":
			return `${localeFormat(date, "{MMM}")}`;
		case "month":
			return `${localeFormat(date, "{MMMM}")}`;
		case "year":
			return `${format(date, "{yyyy}")}`;
	}
};

/**
 * Adds months to a date
 */
const addMonths = (input: Date, months: number): Date => {
	const date = new Date(input);
	date.setDate(1);
	date.setMonth(date.getMonth() + months);
	date.setDate(
		Math.min(
			input.getDate(),
			getDaysInMonth(date.getFullYear(), date.getMonth()),
		),
	);
	return date;
};

/**
 * Adds years to a date
 */
const addYears = (input: Date, years: number): Date => {
	const date = new Date(input);
	date.setFullYear(date.getFullYear() + years);
	return date;
};

/**
 * Adds days to a date
 */
const addDays = (input: Date, days: number): Date => {
	const date = new Date(input);
	date.setDate(date.getDate() + days);
	return date;
};

/**
 * Gets the number of days in a specific month
 */
const getDaysInMonth = (year: number, month: number): number =>
	new Date(year, month + 1, 0).getDate();

/**
 * Gets the first day of a month (UTC)
 */
const getFirstDayOfMonth = (year: number, month: number): Date => {
	return new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
};

/**
 * Gets the last day of a month (UTC)
 */
const getLastDayOfMonth = (year: number, month: number): Date => {
	return new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
};

/**
 * Gets the start of the current year
 */
const getStartOfYear = (year?: number): Date => {
	const targetYear = year ?? new Date().getFullYear();
	return new Date(targetYear, 0, 1);
};

/**
 * Gets the end of the current year
 */
const getEndOfYear = (year?: number): Date => {
	const targetYear = year ?? new Date().getFullYear();
	return new Date(targetYear, 11, 31, 23, 59, 59, 999);
};

/**
 * Checks if two dates are the same day
 */
const isSameDay = (date1: Date, date2: Date): boolean => {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
};

/**
 * Checks if two dates are in the same month
 */
const isSameMonth = (date1: Date, date2: Date): boolean => {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth()
	);
};

/**
 * Checks if two dates are in the same year
 */
const isSameYear = (date1: Date, date2: Date): boolean => {
	return date1.getFullYear() === date2.getFullYear();
};

/**
 * Converts milliseconds to hours
 */
const msToHours = (ms: number): number => ms / 1000 / 60 / 60;

/**
 * Converts milliseconds to minutes
 */
const msToMinutes = (ms: number): number => ms / 1000 / 60;

/**
 * Gets milliseconds played in minutes with formatting
 */
const getMsPlayedInMinutes = (msPlayed: number | string): string =>
	(Number(msPlayed) / (1000 * 60)).toFixed(2);

/**
 * Checks if a date is within a date range (inclusive)
 */
const isDateInRange = (
	date: Date,
	startDate?: Date,
	endDate?: Date,
): boolean => {
	const timestamp = date.getTime();
	return (
		timestamp >= (startDate?.getTime() || 0) &&
		timestamp <= (endDate?.getTime() || 0)
	);
};

const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const YEARS_2015_TO_CURRENT = Array.from(
	{ length: new Date().getFullYear() - 2015 + 1 },
	(_, i) => String(2015 + i),
);

export const DateUtils = {
	formatDate,
	addMonths,
	addYears,
	addDays,
	getDaysInMonth,
	getFirstDayOfMonth,
	getLastDayOfMonth,
	getStartOfYear,
	getEndOfYear,
	isSameDay,
	isSameMonth,
	isSameYear,
	msToHours,
	msToMinutes,
	getMsPlayedInMinutes,
	isDateInRange,
	MONTHS,
	YEARS_2015_TO_CURRENT,
};
