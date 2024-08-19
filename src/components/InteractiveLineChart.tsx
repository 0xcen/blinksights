"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface InteractiveLineChartProps {
  title: string;
  description: string;
  chartData: { date: string; views: number }[];
  chartConfig: {
    views: {
      label: string;
      color: string;
    };
  };
  selectDisabled: boolean;
  timeRanges: string[];
  currentTimeRange: string;
  onTimeRangeChange: (range: string) => void;
}

export const InteractiveLineChart: React.FC<InteractiveLineChartProps> = ({
  title,
  description,
  chartData,
  chartConfig,
  timeRanges,
  selectDisabled,
  currentTimeRange,
  onTimeRangeChange,
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Select value={currentTimeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 24 hours" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="24h" className="rounded-lg">
                Last 24 hours
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg" disabled={selectDisabled}>
                Last 30 days {selectDisabled && <span> (Pro)</span>}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`fillviews`} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartConfig.views?.color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartConfig.views?.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value: string | number) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value: string | number) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="views"
                type="linear"
                fill={`url(#fillviews)`}
                stroke={chartConfig.views?.color}
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
