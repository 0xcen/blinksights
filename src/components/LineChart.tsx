"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
const generateChartData = () => {
  const data = [];
  let renders = 10000;
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    // Random change between -30 and 70, skewed towards positive values
    const change = Math.floor(Math.random() * 101) - 30;
    renders += change;
    renders = Math.max(renders, 0); // Ensure renders doesn't go negative

    // Interaction rate increases from 1% to 25% over time
    const baseInteractionRate = 0.01 + (0.24 * (29 - i)) / 29;
    const spikeChance = Math.random();
    const interactionRate =
      spikeChance > 0.995 // 0.5% chance for a spike
        ? baseInteractionRate + Math.random() * 0.15 // Spike can increase up to 15%
        : baseInteractionRate;
    const interactions = Math.floor(renders * interactionRate);

    data.push({
      date: date.toISOString().split("T")[0], // Format as YYYY-MM-DD
      renders,
      interactions,
    });
  }

  return data;
};

const chartData = generateChartData();

const chartConfig = {
  renders: {
    label: "Renders",
    color: "hsl(var(--chart-1))",
  },
  interactions: {
    label: "Interactions",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function Component() {
  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Area
          dataKey="renders"
          type="natural"
          fill="var(--color-renders)"
          fillOpacity={0.4}
          stroke="var(--color-renders)"
        />
        <Area
          dataKey="interactions"
          type="natural"
          fill="var(--color-interactions)"
          fillOpacity={0.4}
          stroke="var(--color-interactions)"
        />
      </AreaChart>
    </ChartContainer>
  );
}
