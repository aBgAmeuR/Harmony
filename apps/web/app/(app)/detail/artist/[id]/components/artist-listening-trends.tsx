"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/chart";
import { Brain, Gauge } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  Scatter,
  XAxis,
  YAxis,
} from "recharts";

type ArtistListeningTrendsProps = {
  stats: {
    monthlyTrends: Array<{
      month: string;
      minutes: number;
      streams: number;
    }>;
    timeDistribution: Array<{
      hour: string;
      minutes: number;
    }>;
  };
};

const chartConfig = {
  minutes: {
    label: "Minutes",
    color: "hsl(var(--chart-1))",
  },
  streams: {
    label: "Streams",
    color: "hsl(var(--chart-2))",
  },
  time: {
    label: "Time",
    color: "hsl(var(--chart-3))",
  },
  ratio: {
    label: "Minutes per Stream",
    color: "hsl(var(--chart-4))",
  },
  avgRatio: {
    label: "Average",
    color: "hsl(var(--chart-5))",
  },
  barRatio: {
    label: "Bar Chart",
    color: "hsl(var(--chart-4) / 0.3)",
  },
} satisfies ChartConfig;

export function ArtistListeningTrends({ stats }: ArtistListeningTrendsProps) {
  // Calculate minutes per stream ratio and average
  const enrichedData = stats.monthlyTrends.map((item) => ({
    ...item,
    streamRatio: +(item.minutes / item.streams).toFixed(2),
    lineRatio: +(item.minutes / item.streams).toFixed(2),
  }));

  const avgRatio = +(
    enrichedData.reduce((sum, item) => sum + item.streamRatio, 0) /
    enrichedData.length
  ).toFixed(2);

  return (
    <div className="grid gap-4">
      {/* Monthly Listening Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Listening Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full">
            <ChartContainer config={chartConfig}>
              <AreaChart data={stats.monthlyTrends}>
                <defs>
                  <linearGradient
                    id="gradientMinutes"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-minutes)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-minutes)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient
                    id="gradientStreams"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-streams)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-streams)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                    })
                  }
                />
                <YAxis
                  yAxisId="minutes"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}m`}
                />
                <YAxis
                  yAxisId="streams"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })
                      }
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="minutes"
                  stroke="var(--color-minutes)"
                  fill="url(#gradientMinutes)"
                  yAxisId="minutes"
                  isAnimationActive
                  animationDuration={1000}
                />
                <Area
                  type="monotone"
                  dataKey="streams"
                  stroke="var(--color-streams)"
                  fill="url(#gradientStreams)"
                  yAxisId="streams"
                  isAnimationActive
                  animationDuration={1000}
                  animationBegin={300}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      <div className="grid md:grid-cols-2 gap-4 w-full">
        {/* Stream Efficiency Analysis */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">
              Stream Efficiency Analysis
            </CardTitle>
            <Gauge className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full">
              <ChartContainer config={chartConfig}>
                <ComposedChart data={enrichedData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                      })
                    }
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    domain={[0, "auto"]}
                    tickFormatter={(value) => `${value}m`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) =>
                          new Date(value).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })
                        }
                      />
                    }
                  />
                  <ReferenceLine
                    y={avgRatio}
                    stroke="var(--color-avgRatio)"
                    strokeDasharray="3 3"
                  />
                  <Bar
                    dataKey="streamRatio"
                    fill="var(--color-barRatio)"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive
                    animationDuration={1000}
                  />
                  <Line
                    type="monotone"
                    dataKey="lineRatio"
                    stroke="var(--color-ratio)"
                    strokeWidth={2}
                    dot={<Scatter fill="var(--color-ratio)" r={4} />}
                    isAnimationActive
                    animationDuration={1000}
                    animationBegin={300}
                  />
                </ComposedChart>
              </ChartContainer>
              <ChartLegend>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-[var(--color-ratio)]" />
                    <span className="text-sm">Minutes per Stream</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-[var(--color-avgRatio)]" />
                    <span className="text-sm">Average ({avgRatio}m)</span>
                  </div>
                </div>
              </ChartLegend>
            </div>
          </CardContent>
        </Card>

        {/* Time Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">
              Listening Patterns
            </CardTitle>
            <Brain className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full">
              <ChartContainer config={chartConfig}>
                <BarChart data={stats.timeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="hour"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}h`}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}m`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => [value, "minutes"]}
                        labelFormatter={(value) => `${value}:00`}
                      />
                    }
                  />
                  <Bar
                    dataKey="minutes"
                    fill="var(--color-time)"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive
                    animationDuration={1000}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
