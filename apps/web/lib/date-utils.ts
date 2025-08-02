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
			return `${localeFormat(date, "{MMMM}")} ${format(date, "{dd},{yyyy}")}`;
		case "short":
			return `${localeFormat(date, "{MMM}")} ${format(date, "{dd},{yyyy}")}`;
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

export const getMonthIndex = (
	monthStr: string,
): { monthIndex: number; year: number } => {
	const match = monthStr.match(/^([A-Za-z]+)\s+(\d{4})$/);
	if (!match) return { monthIndex: -1, year: 0 };
	const [, monthName, yearStr] = match;
	const monthIndex = MONTHS.findIndex((m) => m === monthName);
	return { monthIndex, year: Number.parseInt(yearStr) };
};

export const generateMonthRange = (
	first: { monthIndex: number; year: number },
	last: { monthIndex: number; year: number },
): string[] => {
	const result: string[] = [];
	let y = first.year;
	let m = first.monthIndex;
	while (y < last.year || (y === last.year && m <= last.monthIndex)) {
		result.push(`${MONTHS[m]} ${y}`);
		m++;
		if (m > 11) {
			m = 0;
			y++;
		}
	}
	return result;
};

export const getWeek = (date: Date): number => {
	const target = new Date(date.valueOf());
	// ISO week date weeks start on monday
	// so correct the day number
	const dayNr = (date.getDay() + 6) % 7;

	// Set the target to the thursday of this week so the
	// target date is in the right year
	target.setDate(target.getDate() - dayNr + 3);

	// ISO 8601 states that week 1 is the week
	// with january 4th in it
	const jan4 = new Date(target.getFullYear(), 0, 4);

	// Number of days between target date and january 4th
	const dayDiff = (target.getTime() - jan4.getTime()) / 86400000;

	// Calculate week number: Week 1 (january 4th) plus the
	// number of weeks between target date and january 4th
	const weekNr = 1 + Math.ceil(dayDiff / 7);

	return weekNr;
};

export const getLastDayOfWeek = (weekNumber: number, year: number): Date => {
	// First day of the year
	const firstDayOfYear = new Date(year, 0, 1);
	const dayOfWeek = firstDayOfYear.getDay(); // 0 (Sun) to 6 (Sat)

	// Adjust to Monday (ISO week starts on Monday)
	const daysOffset = dayOfWeek <= 4 ? dayOfWeek - 1 : dayOfWeek - 8;
	const firstMonday = new Date(year, 0, 1 - daysOffset);

	// Calculate the last day (Sunday) of the given ISO week number
	const lastDay = new Date(firstMonday);
	lastDay.setDate(firstMonday.getDate() + (weekNumber - 1) * 7 + 6); // +6 for Sunday

	return lastDay;
};

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
	getMonthIndex,
	generateMonthRange,
	getWeek,
	getLastDayOfWeek,
};
