"use client";
import { ChartSpline } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { FC, PropsWithChildren } from "react";

const Logo: FC = () => {
  const { data: session } = useSession();
  return (
    <div className="flex items-center gap-2 font-semibold">
      <ChartSpline className="h-6 w-6" />
      <span className="">
        {session?.org ? session.org.name : "Blinksights"}
      </span>
    </div>
  );
};

export default Logo;
