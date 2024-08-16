"use client";
import { useMemo, useState } from "react";
import { InteractiveLineChart } from "~/components/InteractiveLineChart";
import useAllBlinkEvents from "~/hooks/useAllBlinkEvents";
import useBlinkAnalytics from "~/hooks/useBlinkAnalytics";
import { sortStats } from "~/lib/utils";

interface BlinkViewsChartProps {
  orgId: string;
  timeRanges: string[];
}

const mergeData = (
  viewsArray: { date: string; views: number }[],
  interactionsArray: { date: string; interactions: number }[]
) => {
  const map = new Map<string, { views: number; interactions: number }>();

  viewsArray.forEach(({ date, views }) => {
    if (!map.has(date)) {
      map.set(date, { views, interactions: 0 });
    } else {
      map.get(date)!.views = views;
    }
  });

  interactionsArray.forEach(({ date, interactions }) => {
    if (!map.has(date)) {
      map.set(date, { views: 0, interactions });
    } else {
      map.get(date)!.interactions = interactions;
    }
  });

  return Array.from(map, ([date, { views, interactions }]) => ({
    date,
    views,
    interactions,
  }));
};

const AllBlinkEventsChart: React.FC<BlinkViewsChartProps> = ({
  orgId,
  timeRanges,
}) => {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">(
    timeRanges[0] as "24h" | "7d" | "30d",
  );
  const analytics = useAllBlinkEvents(orgId, timeRange);
  const {views, interactions} = sortStats(analytics.data?.events ?? []);

  const eventsPerDay = useMemo(() => {
    if (!analytics.data?.events) return [];
  
    const allViews = views.data.reduce(
      (acc, event) => {
        const date = event.timestamp.toISOString().split("T")[0] ?? "";
        if (date in acc) {
          acc[date]! += 1;
        } else {
          acc[date] = 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );
  
    const allInteractions = interactions.data.reduce(
      (acc, event) => {
        const date = event.timestamp.toISOString().split("T")[0] ?? "";
        if (date in acc) {
          acc[date]! += 1;
        } else {
          acc[date] = 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );
  
    const allViewsArray = Object.entries(allViews).map(([date, views]) => ({ date, views }));
    const allInteractionsArray = Object.entries(allInteractions).map(([date, interactions]) => ({ date, interactions }));
  
    const entries = mergeData(allViewsArray, allInteractionsArray);
  
    return entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [analytics.data?.events]);

  return (
    <InteractiveLineChart
      title={"Views"}
      description={"Your blinks have been seen a lot this week."}
      chartData={eventsPerDay}
      chartConfig={[
        {
          label: "Views",
          color: "hsl(var(--chart-1))",
        },
        {
          label: "Interactions",
          color: "hsl(var(--chart-2))",
        },
      ]}
      timeRanges={timeRanges}
      currentTimeRange={timeRange}
      onTimeRangeChange={(range) => setTimeRange(range as "24h" | "7d" | "30d")}
    />
  );
};

export default AllBlinkEventsChart;
