"use client";
import { useSession } from "next-auth/react";
import React, { FC, PropsWithChildren } from "react";
import NumberCard from "../components/NumberCard";
import { sortStats } from "../lib/utils";
import useAllBlinkEvents from "~/hooks/useAllBlinkEvents";
import AllBlinkEventsChart from "~/components/AllBlinkEventsChart";
import {DashboardInsights} from "~/components/DashboardInsights";

const Dashboard: FC = () => {
  const { data: session } = useSession();

  let orgExists = true;
  if (!session?.org || !session?.org.id) orgExists = false;
  const orgId = orgExists ? session?.org.id : "";
  
  const allEvents = useAllBlinkEvents(orgId!, "7d");

  if (!orgExists) {
    return null;
  }

  if (!allEvents.data?.events) return null;

  const {views, interactions, confirmations} = sortStats(allEvents.data?.events);

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
