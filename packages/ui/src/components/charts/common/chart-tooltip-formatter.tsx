"use client";

import { type ChartTooltipContent } from "@repo/ui/chart";
import { NumberFlow } from "@repo/ui/components/number";

type Formatter = React.ComponentProps<typeof ChartTooltipContent>["formatter"];

const createChartTooltipFormatter = (suffix?: string, format?: (value: number | string | (string | number)[]) => string | number): Formatter => (value, name, item, index, payload) => {
	const indicatorColor = item?.payload?.fill || item?.color;

	return (
		<>
			<div
				className="shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg) h-2.5 w-2.5"
				style={{
					"--color-bg": indicatorColor,
					"--color-border": indicatorColor,
				} as React.CSSProperties}
			/>
			<div className="flex flex-1 justify-between leading-none gap-2">
				<div className="grid gap-1.5">
					<span className="text-muted-foreground">
						{item?.payload?.label || name}
					</span>
				</div>
				<span className="text-foreground font-mono font-medium tabular-nums h-3">
					<NumberFlow value={format ? format(item.value ?? 0) : getMsPlayedInHours(item.value ?? 0, false)} suffix={suffix} className="-translate-y-[3px]" />
				</span>
			</div>
		</>
	)
};

const getMsPlayedInHours = (
	ms: number | string | (string | number)[],
	showDecimals = true,
): string => {
	if (Array.isArray(ms)) {
		return ms.map((item) => getMsPlayedInHours(item, showDecimals)).join(", ");
	}
	const msNum = typeof ms === "string" ? Number.parseInt(ms, 10) : ms;
	return msToHours(msNum, showDecimals).toFixed(showDecimals ? 2 : 0);
};

const msToHours = (ms: number, showDecimals = true): number => {
	const hours = ms / 1000 / 60 / 60;
	return showDecimals ? hours : Math.floor(hours);
};

export const chartTooltipFormatter = {
	hourSuffix: createChartTooltipFormatter("h"),
	normal: createChartTooltipFormatter("", (value) => value as string),
} as const;

export type ChartTooltipFormatter = keyof typeof chartTooltipFormatter;

export const getChartTooltipFormatter = (value: ChartTooltipFormatter | undefined) => {
	if (!value) return undefined;
	const fn = chartTooltipFormatter[value];
	if (!fn) return undefined;
	return fn;
}
