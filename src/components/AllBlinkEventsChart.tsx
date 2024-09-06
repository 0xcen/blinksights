"use client";
import { useMemo, useState } from "react";
import { InteractiveMultiLineChart } from "~/components/InteractiveMultiLineChart";
import useAllBlinkEvents from "~/hooks/useAllBlinkEvents";
import { sortStats, mapTimeRangeToDays } from "~/lib/utils";
import { BlinkViewsChartProps } from "~/types/tableTypes";
import useAllBlinks from "~/hooks/useAllBlinks";
import { sortBlinksByDevAndProd, filterEventsByDevAndProd } from "~/lib/utils";
import { useDevModeStore } from "~/store/devModeStore";

const mergeData = (
  viewsArray: { date: string; views: number }[],
  interactionsArray: { date: string; interactions: number }[],
  confirmationsArray: { date: string; confirmations: number }[]
) => {
  const map = new Map<string, { views: number; interactions: number; confirmations: number }>();

  viewsArray.forEach(({ date, views }) => {
    if (!map.has(date)) {
      map.set(date, { views, interactions: 0, confirmations: 0 });
    } else {
      map.get(date)!.views = views;
    }
  });

  interactionsArray.forEach(({ date, interactions }) => {
    if (!map.has(date)) {
      map.set(date, { views: 0, interactions, confirmations: 0 });
    } else {
      map.get(date)!.interactions = interactions;
    }
  });

  confirmationsArray.forEach(({ date, confirmations }) => {
    if (!map.has(date)) {
      map.set(date, { views: 0, interactions: 0, confirmations });
    } else {
      map.get(date)!.confirmations = confirmations;
    }
    });

  return Array.from(map, ([date, { views, interactions, confirmations }]) => ({
    date,
    views,
    interactions,
    confirmations
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

  const devMode = useDevModeStore((state) => state.devMode);
  const blinks = useAllBlinks(orgId);
  const {devBlinks, prodBlinks} = sortBlinksByDevAndProd(blinks.data?.blinks || []);

  
  const filteredEvents = filterEventsByDevAndProd(devMode, analytics.data?.events ?? [], devBlinks, prodBlinks);

  
  const {views, interactions, confirmations} = sortStats(filteredEvents ?? []);

  

  const eventsPerDay = useMemo(() => {
    if (!filteredEvents) return [];
  
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

    const allConfirmations = confirmations.data.reduce(
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
      
      if (!(dateString in allViews)) {
        allViews[dateString] = 0;
      }
      if (!(dateString in allInteractions)) {
        allInteractions[dateString] = 0;
      }
      if (!(dateString in allConfirmations)) {
        allConfirmations[dateString] = 0;
      }
      date.setDate(date.getDate() + 1);
    }
  
    const allViewsArray = Object.entries(allViews).map(([date, views]) => ({
      date,
      views
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());  //Object.entries(allViews).map(([date, views]) => ({ date, views }));
    const allInteractionsArray = Object.entries(allInteractions).map(([date, interactions]) => ({
      date,
      interactions
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Object.entries(allInteractions).map(([date, interactions]) => ({ date, interactions }));
    const allConfirmationsArray = Object.entries(allConfirmations).map(([date, confirmations]) => ({
      date,
      confirmations
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Object.entries(allInteractions).map(([date, interactions]) => ({ date, interactions }));
    const entries = mergeData(allViewsArray, allInteractionsArray, allConfirmationsArray);

    return entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredEvents]);

  

  return (
    <InteractiveMultiLineChart
      title={"Blink Events"}
      description={"Your blinks have been seen a lot this week."}
      chartData={eventsPerDay}
      chartConfig={{
        views: {
          label: "Views",
          color: "hsl(var(--chart-1))",
        },
        interactions: {
          label: "Interactions",
          color: "hsl(var(--chart-2))",
        },
        confirmations: {
          label: "Confirmations",
          color: "hsl(var(--chart-3))",
        },
      }}
      timeRanges={timeRanges}
      currentTimeRange={timeRange}
      onTimeRangeChange={(range) => setTimeRange(range as "24h" | "7d" | "30d")}
    />
  );
};

export default AllBlinkEventsChart;
