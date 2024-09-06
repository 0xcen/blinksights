"use client";
import { useSession } from "next-auth/react";
import React, { FC, PropsWithChildren } from "react";
import NumberCard from "../components/NumberCard";
import { sortStats } from "../lib/utils";
import useAllBlinkEvents from "~/hooks/useAllBlinkEvents";
import useBlinks from "~/hooks/useBlinks";
import AllBlinkEventsChart from "~/components/AllBlinkEventsChart";
import {DashboardInsights} from "~/components/DashboardInsights";
import useAllBlinks from "~/hooks/useAllBlinks";
import { sortBlinksByDevAndProd, filterEventsByDevAndProd } from "~/lib/utils";
import { useDevModeStore } from "~/store/devModeStore";

const Dashboard: FC = () => {
  const { data: session } = useSession();

  let orgExists = true;
  if (!session?.org || !session?.org.id) orgExists = false;
  const orgId = orgExists ? session?.org.id : "";
  
  const allEvents = useAllBlinkEvents(orgId!, "7d");

  const devMode = useDevModeStore((state) => state.devMode);
  const blinks = useAllBlinks(orgId!);
  const {devBlinks, prodBlinks} = sortBlinksByDevAndProd(blinks.data?.blinks || []);

  
  const filteredEvents = filterEventsByDevAndProd(devMode, allEvents.data?.events ?? [], devBlinks, prodBlinks);

  if (!orgExists) {
    return null;
  }

  if (!allEvents.data?.events) return null;

  const {views, interactions, confirmations} = sortStats(filteredEvents);

  return (
    <>
      <div className="flex gap-2">
        <NumberCard
          title={"Views"}
          value={views.data.length.toString()}
          description={"Your blinks have been seen a lot this week."}
        />{" "}
        <NumberCard
          title={"Interactions"}
          value={interactions.data.length.toString()}
          description={"Your blinks got a lot of interactions this week."}
        />{" "}
        <NumberCard
          title={"Conversions"}
          value={confirmations.data.length.toString()}
          description={"Your blinks got a lot of conversions this week."}
        />{" "}
      </div>
      <AllBlinkEventsChart orgId={orgId!} timeRanges={["7d", "14d", "30d"]} />
      <DashboardInsights orgId={orgId!} timeRanges={["7d", "14d", "30d"]} />
    </>
  );
};

export default Dashboard;
