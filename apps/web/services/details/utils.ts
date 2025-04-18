export const getMonthIndex = (
	monthStr: string,
	months: string[],
): { monthIndex: number; year: number } => {
	const match = monthStr.match(/^([A-Za-z]+)\s+(\d{4})$/);
	if (!match) return { monthIndex: -1, year: 0 };
	const [, monthName, yearStr] = match;
	const monthIndex = months.findIndex((m) => m === monthName);
	return { monthIndex, year: Number.parseInt(yearStr) };
};

export const generateMonthRange = (
	first: { monthIndex: number; year: number },
	last: { monthIndex: number; year: number },
	months: string[],
): string[] => {
	const result: string[] = [];
	let y = first.year,
		m = first.monthIndex;
	while (y < last.year || (y === last.year && m <= last.monthIndex)) {
		result.push(`${months[m]} ${y}`);
		m++;
		if (m > 11) {
			m = 0;
			y++;
		}
	}
	return result;
};
