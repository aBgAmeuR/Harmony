"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/chart";
import { NumberFlow } from "@repo/ui/components/number";
import { Label, Pie, PieChart } from "recharts";

import { getMsPlayedInHours } from "~/lib/utils";

import { getTopPlatforms } from "./get-charts-data";

const chartConfig = {
  // msPlayed: {
  //   label: "Listening Time",
  //   color: "var(--chart-2)",
  // },
} satisfies ChartConfig;

type Data = Awaited<ReturnType<typeof getTopPlatforms>>;

type TopPlatformChartProps = {
  data: Data;
};

const colorData = (data: Data) => {
  const colors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
  ];

  return data?.map((item, index) => ({
    ...item,
    fill: colors[index],
  }));
};

export const TopPlatformChart = ({
  data: chartData,
}: TopPlatformChartProps) => {
  if (!chartData) return null;

  const totalListings = chartData.reduce(
    (total, { msPlayed }) => total + msPlayed,
    0,
  );

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square min-w-60 w-full"
    >
      <PieChart margin={{ top: -10, left: -10, right: -10, bottom: -10 }}>
        <ChartTooltip
          content={(props) => (
            <CustomTooltip {...props}
              label="Time listened"
              formatter={(value) => getMsPlayedInHours(value, true)}
              header={(payload) => `${payload.platform.charAt(0).toUpperCase()}${payload.platform.slice(1)}`}
              suffix="h"
            />
          )}
          cursor={true}
        />
        <Pie
          data={colorData(chartData)}
          dataKey="msPlayed"
          nameKey="platform"
          innerRadius={70}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {`${getMsPlayedInHours(totalListings, false)}h`}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Hours listened
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
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
                style={{ "backgroundColor": item.payload.fill } as React.CSSProperties}
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
