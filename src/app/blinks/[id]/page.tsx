"use client";
import { useParams } from "next/navigation";
import NumberCard from "../../../components/NumberCard";
import useBlink from "../../../hooks/useBlink";
import BreadcrumbNav from "../../../components/BreadcrumbNav";

const Page = () => {
  const { id } = useParams();
  const blink = useBlink(id as string);

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
    </div>
  );
};

export default Page;
