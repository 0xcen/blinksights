"use client";
import { useMemo, useState } from "react";
import { InteractiveLineChart } from "~/components/InteractiveLineChart";
import useBlinkAnalytics from "~/hooks/useBlinkAnalytics";
import { sortStats } from "~/lib/utils";
import { EventType } from "~/enums/index";

interface BlinkViewsChartProps {
  blinkId: string;
  timeRanges: string[];
  eventType: EventType;
}

const mapTimeRangeToDays = (timeRange: string): number => {
  switch (timeRange) {
    case "24h":
      return 1;
    case "7d":
      return 7;
    case "30d":
      return 30;
    default:
      return 7;
  }
}

const BlinkViewsChart: React.FC<BlinkViewsChartProps> = ({
  blinkId,
  timeRanges,
  eventType,
}) => {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">(
    timeRanges[0] as "24h" | "7d" | "30d",
  );
  const analytics = useBlinkAnalytics(blinkId, timeRange);
  const allEvents = analytics.data?.events.filter(
    (event) => event.eventType === eventType,
  );

  const viewsPerDay = useMemo(() => {
    if (!allEvents) return [];

    const dailyViews = allEvents.reduce(
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

    const range = mapTimeRangeToDays(timeRange);
    const today = new Date();
    const date = new Date(today);
    date.setDate(today.getDate() - range);

    while (date <= today) {
      const dateString = date.toISOString().split("T")[0];

      if(!dateString) continue;
      
      if (!(dateString in dailyViews)) {
        dailyViews[dateString] = 0;
      }
      date.setDate(date.getDate() + 1);
    }
  

    return Object.entries(dailyViews)
      .map(([date, views]) => ({
        date,
        views,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allEvents]);

  const label = eventType === EventType.RENDER ? "Views" : "Interactions"

  return (
    <InteractiveLineChart
      title={label}
      description={"Your blinks have been seen a lot this week."}
      chartData={viewsPerDay}
      chartConfig={{
        views: {
          label: label,
          color: "hsl(var(--chart-1))",
        },
      }}
      timeRanges={timeRanges}
      currentTimeRange={timeRange}
      onTimeRangeChange={(range) => setTimeRange(range as "24h" | "7d" | "30d")}
    />
  );
};

export default BlinkViewsChart;
