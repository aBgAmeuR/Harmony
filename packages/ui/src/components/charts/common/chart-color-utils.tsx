/**
 * Creates gradient definitions for chart areas
 */
export const createGradientDefs = (
	chartItems: { color: string; label: string }[],
) => {
	return (
		<defs>
			{chartItems.map((item, index) => {
				const id = `fill${item.label.replace(/\s+/g, "")}`;
				return (
					<linearGradient key={index} id={id} x1="0" y1="0" x2="0" y2="1">
						<stop offset="20%" stopColor={item.color} stopOpacity={0.8} />
						<stop offset="95%" stopColor={item.color} stopOpacity={0.4} />
					</linearGradient>
				);
			})}
		</defs>
	);
};

/**
 * Assigns colors to chart data items
 */
export const colorizeData = <T extends Record<string, any>>(
	data: T[] | null | undefined,
	colorPalette: string[] = [
		"var(--chart-1)",
		"var(--chart-2)",
		"var(--chart-3)",
		"var(--chart-4)",
	],
): (T & { fill: string })[] => {
	if (!data) return [];

	return data.map((item, index) => ({
		...item,
		fill: colorPalette[index % colorPalette.length],
	}));
};
