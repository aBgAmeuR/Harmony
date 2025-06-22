"use client";

import { cn } from "../../lib/utils";
import { type ChartTooltipContent, useChart } from "@repo/ui/chart";
import { NumberFlow } from "@repo/ui/components/number";

type Formatter = React.ComponentProps<typeof ChartTooltipContent>["formatter"];

/**
 * Format chart tooltip values
 * This formatter can handle various data types including time in milliseconds
 */
export const ChartTooltipFormatter: Formatter = (value, name, item, index, payload) => {
	const indicatorColor = item?.payload?.fill || item?.color;
	const label = item?.payload?.label || name;

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
						{label}
					</span>
				</div>
				<span className="text-foreground font-mono font-medium tabular-nums h-3">
					<NumberFlow value={getMsPlayedInHours(item.value ?? 0, true)} suffix="h" className="-translate-y-[3px]" />
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
