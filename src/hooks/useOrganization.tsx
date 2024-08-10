"use client";
import { api } from "../trpc/react";

interface Props {
  orgId: string;
}

const useOrganization = ({ orgId }: Props) => {
  const org = api.organization.get.useQuery({
    id: orgId,
  });

  return {
    org,
  };
};

export default useOrganization;
