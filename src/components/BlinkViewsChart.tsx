"use client";
import { useMemo, useState } from "react";
import { InteractiveLineChart } from "~/components/InteractiveLineChart";
import useBlinkAnalytics from "~/hooks/useBlinkAnalytics";

interface BlinkViewsChartProps {
  blinkId: string;
  timeRanges: string[];
}

const BlinkViewsChart: React.FC<BlinkViewsChartProps> = ({
  blinkId,
  timeRanges,
}) => {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">(
    timeRanges[0] as "24h" | "7d" | "30d",
  );
  const analytics = useBlinkAnalytics(blinkId, timeRange);

  const viewsPerDay = useMemo(() => {
    if (!analytics.data?.events) return [];

    const dailyViews = analytics.data.events.reduce(
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

    return Object.entries(dailyViews)
      .map(([date, views]) => ({
        date,
        views,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [analytics.data?.events]);

  return (
    <InteractiveLineChart
      title={"Views"}
      description={"Your blinks have been seen a lot this week."}
      chartData={viewsPerDay}
      chartConfig={{
        views: {
          label: "Views",
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
