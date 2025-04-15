'use client'

import { NumberFlow } from "@repo/ui/components/number";
import { ChartTooltipContent, useChart } from "@repo/ui/chart";

type Formatter = React.ComponentProps<typeof ChartTooltipContent>['formatter']

/**
 * Format chart tooltip values
 * This formatter can handle various data types including time in milliseconds
 */
export const ChartTooltipFormatter: Formatter = (value, name, item) => {
  const { config } = useChart();
  const indicatorColor = item?.payload?.fill || item?.color;
  const label = config[name as keyof typeof config]?.label || name;

  return (
    <div className="flex min-w-[130px] w-full justify-between gap-2 items-center text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <div
          className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
          style={{ "--color-bg": indicatorColor } as React.CSSProperties}
        />
        {label}
      </div>
      <div className="font-medium tabular-nums text-foreground">
        <NumberFlow value={getMsPlayedInHours(value, true)} suffix="h" />
      </div>
    </div>
  );
}

const getMsPlayedInHours = (ms: number | string | (string | number)[], showDecimals = true): string => {
  if (Array.isArray(ms)) {
    return ms.map((item) => getMsPlayedInHours(item, showDecimals)).join(", ");
  }
  const msNum = typeof ms === 'string' ? parseInt(ms, 10) : ms;
  return msToHours(msNum, showDecimals).toFixed(showDecimals ? 2 : 0);
};

const msToHours = (ms: number, showDecimals = true): number => {
  const hours = ms / 1000 / 60 / 60;
  return showDecimals ? hours : Math.floor(hours);
};
