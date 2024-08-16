"use client";
import { useParams } from "next/navigation";
import useBlink from "../../../hooks/useBlink";
import BreadcrumbNav from "../../../components/BreadcrumbNav";
import BlinkViewsChart from "~/components/BlinkViewsChart";
import NumberCard from "../../../components/NumberCard";
import useBlinkAnalytics from "../../../hooks/useBlinkAnalytics";
import { BlinkEvent } from "../../../types/tableTypes";
import { sortStats } from "../../../lib/utils";

const inTimeRange = (date: Date, timeRange: number): boolean => {
  const today = new Date();
  const past = new Date(today);
  past.setDate(today.getDate() - timeRange);
  return date >= past && date <= today;
}

const Page = () => {
  const { id } = useParams();
  const blink = useBlink(id as string);
  
  const analytics = useBlinkAnalytics(blink.data?.id as string);

  if(!analytics.data || !analytics.data.events) return null;  

  const events = analytics.data?.events as BlinkEvent[];

  const {views, interactions} = sortStats(events ?? []);
  const timeRanges = ["7d", "30d", "90d", "1y"];

  const renderStats = (data: {label: string, data: BlinkEvent[]}) => {
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 md:flex-nowrap">
          <NumberCard title={`24h ${' ' + data.label}`} value={data.data.filter(item => inTimeRange(item.timestamp, 1)).length?.toString() ?? "0"} description=""/>
          <NumberCard title={`7d ${' ' + data.label}`} value={data.data.filter(item => inTimeRange(item.timestamp, 7)).length?.toString() ?? "0"} description=""/>
          <NumberCard title={`30d ${' ' + data.label}`} value={data.data.filter(item => inTimeRange(item.timestamp, 30)).length?.toString() ?? "0"} description=""/>
        </div>
        <BlinkViewsChart blinkId={id as string} timeRanges={timeRanges} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BreadcrumbNav
        items={[
          { label: "Blinks", path: "/blinks" },
          {
            label: blink.data?.title ?? "",
          },
        ]}
      />
      <h1>{blink.data?.title} Blink</h1>
      {renderStats(views)}
      {renderStats(interactions)}
    </div>
  );
};

export default Page;
