"use client";
import { useMemo, useState } from "react";
import { InteractiveLineChart } from "~/components/InteractiveLineChart";
import useBlinkAnalytics from "~/hooks/useBlinkAnalytics";
import { mapTimeRangeToDays } from "~/lib/utils";
import { EventType } from "~/enums/index";
import useOrganization from "~/hooks/useOrganization";
import { Subscription } from "~/enums/index";

interface TypedBlinkViewsChartProps {
  blinkId: string;
  timeRanges: string[];
  eventType: EventType;
}

const BlinkViewsChart: React.FC<TypedBlinkViewsChartProps> = ({
  blinkId,
  timeRanges,
  eventType,
}) => {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">(
    timeRanges[0] as "24h" | "7d" | "30d",
  );
  const analytics = useBlinkAnalytics(blinkId, timeRange);
  let allEvents = analytics.data?.events.filter(
    (event) => event.eventType === eventType,
  );
  
  const organization  = useOrganization();
  const subscription = organization?.data?.subscription;

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

  let label = "Views";
  let graphColor = "hsl(var(--chart-1))";
  
  switch(eventType){
    case EventType.RENDER:
      graphColor = "hsl(var(--chart-1))";
      label = "Views";
      break;
    case EventType.INTERACTION:
      graphColor = "hsl(var(--chart-2))";
      label = "Interactions";
      break;
    case EventType.CONFIRMED:
      graphColor = "hsl(var(--chart-3))";
      label = "Conversions";
      break;
  }

  return (
    <InteractiveLineChart
      title={label}
      description={"Your blinks have been seen a lot this week."}
      chartData={viewsPerDay}
      chartConfig={{
        views: {
          label: label,
          color: graphColor,
        },
      }}
      selectDisabled={false}
      eventType={eventType}
      timeRanges={timeRanges}
      currentTimeRange={timeRange}
      onTimeRangeChange={(range) => setTimeRange(range as "24h" | "7d" | "30d")}
    />
  );
};

export default BlinkViewsChart;
