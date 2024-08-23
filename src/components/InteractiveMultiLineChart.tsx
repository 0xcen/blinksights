"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart"

interface InteractiveMultiLineChartProps {
    title: string;
    description: string;
    chartData: { date: string; views: number, interactions: number, confirmations: number }[];
    chartConfig: {
      views: {
        label: string;
        color: string;
      },
      interactions: {
        label: string;
        color: string;
      },
      confirmations: {
        label: string;
        color: string;
      },
    };
    timeRanges: string[];
    currentTimeRange: string;
    onTimeRangeChange: (range: string) => void;
  }

export const InteractiveMultiLineChart: React.FC<InteractiveMultiLineChartProps> = ({
    title,
    description,
    chartData,
    chartConfig,
    timeRanges,
    currentTimeRange,
    onTimeRangeChange,
}) => {
  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </div>
        {/* <Select value={currentTimeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="24h" className="rounded-lg">
              Last 24 hours
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
            Last 7 days
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
            Last 30 days
            </SelectItem>
          </SelectContent>
        </Select> */}
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="views"
              type="linear"
              fill="url(#fillviews)"
              stroke={chartConfig.views?.color}
              stackId="a"
            />
            <Area
              dataKey="interactions"
              type="linear"
              fill="url(#fillinteractions)"
              stroke={chartConfig.interactions?.color}
              stackId="b"
            />
            <Area
              dataKey="confirmations"
              type="linear"
              fill="url(#fillconfirmations)"
              stroke={chartConfig.confirmations?.color}
              stackId="c"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
