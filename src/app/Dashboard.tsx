"use client";
import { useSession } from "next-auth/react";
import React, { FC, PropsWithChildren } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import NumberCard from "../components/NumberCard";
import { sortStats } from "../lib/utils";
import { BlinkEvent } from "../types/tableTypes";
import useBlinks from "../hooks/useBlinks";
import useBlinkAnalytics from "~/hooks/useBlinkAnalytics";
import useAllBlinkEvents from "~/hooks/useAllBlinkEvents";
import AllBlinkEventsChart from "~/components/AllBlinkEventsChart";

const Dashboard: FC = () => {
  const { data: session } = useSession();
  if (!session?.org.id) return null;
  const orgId = session.org.id;
  const allEvents = useAllBlinkEvents(orgId, "7d");
  if (!allEvents.data?.events) return null;

  const {views, interactions} = sortStats(allEvents.data?.events);

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
          description={"Your blinks have been seen a lot this week."}
        />{" "}
      </div>
      <AllBlinkEventsChart orgId={orgId} timeRanges={["7d", "14d", "30d"]} />
    </>
  );
};

export default Dashboard;
