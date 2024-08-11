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

const Dashboard: FC = () => {
  const { data: session } = useSession();
  return (
    <>
      <div className="flex gap-2">
        <NumberCard
          title={"Views"}
          value={"100,000"}
          description={"Your blinks have been seen a lot this week."}
        />{" "}
        <NumberCard
          title={"Interactions"}
          value={"5,000"}
          description={"Your blinks have been seen a lot this week."}
        />{" "}
      </div>
    </>
  );
};

export default Dashboard;
