"use client";
import { api } from "../trpc/react";

interface Props {
  userId: string;
}

const useOrg = ({ userId }: Props) => {
  const org = api.org.getByUserId.useQuery({
    userId,
  });

  return {
    org,
  };
};

export default useOrg;
