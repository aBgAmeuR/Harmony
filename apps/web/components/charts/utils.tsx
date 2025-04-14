'use client'

import { ChartTooltipContent, useChart } from "@repo/ui/chart";
import { NumberFlow } from "@repo/ui/components/number";
import React from "react";
import { getMsPlayedInHours } from "~/lib/utils";

export type Formatter = React.ComponentProps<typeof ChartTooltipContent>['formatter']

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

export const createGradientDefs = (items: Array<{ label: string, color: string }>) => (
  <defs>
    {items.map(({ label, color }) => (
      <linearGradient key={label} id={`fill${label}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={color} stopOpacity={0.9} />
        <stop offset="95%" stopColor={color} stopOpacity={0.3} />
      </linearGradient>
    ))}
  </defs >
)

export const msToHours = (ms: number) => ms / 1000 / 60 / 60;