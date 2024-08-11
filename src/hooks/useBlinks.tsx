"use client";
import { useSession } from "next-auth/react";
import { api } from "../trpc/react";
import { Blink } from "../types/actions";

interface Props {
  page?: number;
  pageSize?: number;
}

const useBlinks = ({ page, pageSize }: Props) => {
  const { data: session } = useSession();

  const blinks = api.blink.all.useQuery(
    {
      page: page ?? 1,
      pageSize: pageSize ?? 10,
    },
    {
      queryHash: `${session?.org.id}-${page}-${pageSize}`,
    },
  );

  return {
    blinks,
  };
};

export default useBlinks;
