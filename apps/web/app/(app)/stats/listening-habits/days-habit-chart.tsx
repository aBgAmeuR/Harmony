"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/chart";
import { NumberFlow } from "@repo/ui/components/number";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import { getMsPlayedInHours } from "~/lib/utils";

import { getDaysHabit } from "./get-charts-data";

const chartConfig = {
  msPlayed: {
    label: "Listening Time",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type Data = Awaited<ReturnType<typeof getDaysHabit>>;

type DaysHabitChartProps = {
  data: Data;
};

export const DaysHabitChart = ({ data: chartData }: DaysHabitChartProps) => {
  if (!chartData) return null;

  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 24,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip
          content={(props) => (
            <CustomTooltip {...props}
              label="Time listened"
              formatter={(value) => getMsPlayedInHours(value, true)}
              header={(payload) => `${payload.day}`}
              suffix="h"
            />
          )}
          cursor={true}
        />
        <Bar dataKey="msPlayed" fill="var(--color-msPlayed)" radius={8}>
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
            formatter={(value: number) => `${getMsPlayedInHours(value)}h`}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

type CustomTooltipProps = {
  payload?: any[];
  label: string;
  formatter?: (value: number | string) => string;
  suffix?: string;
  header: (payload: any) => string;
};

const CustomTooltip = ({ payload, label, formatter, suffix, header }: CustomTooltipProps) => {
  if (!payload || payload.length === 0) return null;
  const currentData = payload[0].payload;

  return (
    <div className="text-xs flex flex-col bg-background shadow-lg rounded-md border overflow-hidden">
      <div className="border-b p-2 flex justify-between items-center gap-4">
        <p>{header(currentData)}</p>
      </div>
      <div className="flex flex-col gap-1.5 px-3 py-2">
        {payload.map((item, index) => (
          <div key={index} className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-1 truncate">
              <span
                className="size-2.5 shrink-0 rounded-xs"
                style={{ "backgroundColor": item.color } as React.CSSProperties}
                aria-hidden="true"
              />
              <p className="truncate text-muted-foreground">{label}</p>
            </div>
            <div className="font-medium">
              <NumberFlow value={formatter ? formatter(item.value) : item.value} suffix={suffix} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
