"use client";

import type { ChartTooltipContent } from "@repo/ui/chart";
import { NumberFlow } from "@repo/ui/components/number";

type Formatter = React.ComponentProps<typeof ChartTooltipContent>["formatter"];

const createChartTooltipFormatter =
	(
		suffix?: string,
		format?: (value: number | string | (string | number)[]) => string | number,
	): Formatter =>
		(_value, name, item, _indexx_payloadad) => {
			const indicatorColor = item?.payload?.fill || item?.color;

			return (
				<>
					<div
						className="h-2.5 w-2.5 shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)"
						style={
							{
								"--color-bg": indicatorColor,
								"--color-border": indicatorColor,
							} as React.CSSProperties
						}
					/>
					<div className="flex flex-1 justify-between gap-2 leading-none">
						<div className="grid gap-1.5">
							<span className="text-muted-foreground">
								{item?.payload?.label || name}
							</span>
						</div>
						<span className="h-3 font-medium font-mono text-foreground tabular-nums">
							<NumberFlow
								value={
									format
										? format(item.value ?? 0)
										: getMsPlayedInHours(item.value ?? 0, false)
								}
								suffix={suffix}
								className="part-[suffix]:text-xs"
							/>
						</span>
					</div>
				</>
			);
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
	minuteSuffix: createChartTooltipFormatter("min", (value) => value as string),
	hourSuffix: createChartTooltipFormatter("h"),
	normal: createChartTooltipFormatter("", (value) => value as string),
} as const;

export type ChartTooltipFormatter = keyof typeof chartTooltipFormatter;

export const getChartTooltipFormatter = (
	value: ChartTooltipFormatter | undefined,
) => {
	if (!value) return undefined;
	const fn = chartTooltipFormatter[value];
	if (!fn) return undefined;
	return fn;
};
