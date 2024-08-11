"use client";
import { useParams } from "next/navigation";
import useBlink from "../../../hooks/useBlink";
import BreadcrumbNav from "../../../components/BreadcrumbNav";
import BlinkViewsChart from "~/components/BlinkViewsChart";
import NumberCard from "../../../components/NumberCard";
import useBlinkAnalytics from "../../../hooks/useBlinkAnalytics";

const Page = () => {
  const { id } = useParams();
  const blink = useBlink(id as string);
  const analytics = useBlinkAnalytics(id as string);

  const timeRanges = ["7d", "30d", "90d", "1y"];

  return (
    <div className="space-y-2">
      <BreadcrumbNav
        items={[
          { label: "Blinks", path: "/blinks" },
          {
            label: blink.data?.title ?? "",
          },
        ]}
      />

      <h1>{blink.data?.title} Blink</h1>
      <div className="flex flex-wrap gap-2 md:flex-nowrap">
        <NumberCard
          title={"24h Views"}
          value={analytics.data?.events.length?.toString() ?? "0"}
          description={""}
        />
        <NumberCard
          title={"7d Views"}
          value={analytics.data?.events.length?.toString() ?? "0"}
          description={""}
        />
        <NumberCard
          title={"30d Views"}
          value={analytics.data?.events.length?.toString() ?? "0"}
          description={""}
        />
      </div>
      <BlinkViewsChart blinkId={id as string} timeRanges={timeRanges} />
    </div>
  );
};

export default Page;
