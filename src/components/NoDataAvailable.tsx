import { ChartSpline } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { FC, PropsWithChildren } from "react";

const NoDataAvailable: FC = () => {
  const { data: session } = useSession();
  return (
    <div className="flex w-full items-center justify-center font-semibold">
      <p className="text-white opacity-10 my-16 text-4xl">No data available</p>
    </div>
  );
};

export default NoDataAvailable;