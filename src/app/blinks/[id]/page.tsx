"use client";
import { useParams } from "next/navigation";
import useBlink from "../../../hooks/useBlink";
import NumberCard from "../../../components/NumberCard";

const Page = () => {
  const { id } = useParams();
  const blink = useBlink(id as string);

  return (
    <div>
      <h1>{blink.data?.id}</h1>
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
