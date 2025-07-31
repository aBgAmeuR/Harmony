export function calculatePercentageChange(
	oldValue: number,
	newValue: number,
): number {
	if (oldValue === 0) return newValue > 0 ? 100 : 0;
	return ((newValue - oldValue) / oldValue) * 100;
}

export function getChangeIndicator(change: number): {
	label: string;
	color: string;
} {
	if (change > 0) return { label: `+${change.toFixed(1)}%`, color: "green" };
	if (change < 0) return { label: `${change.toFixed(1)}%`, color: "red" };
	return { label: "0%", color: "gray" };
}
