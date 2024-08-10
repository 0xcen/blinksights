"use client";
import { api } from "../trpc/react";

interface Props {
  page?: number;
  pageSize?: number;
}

const useBlinks = ({ page, pageSize }: Props) => {
  const blinks = api.blink.all.useQuery({
    page: page ?? 1,
    pageSize: pageSize ?? 10,
  });

  return {
    blinks,
  };
};

export default useBlinks;
