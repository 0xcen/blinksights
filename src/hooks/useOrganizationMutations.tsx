"use client";
import { api } from "../trpc/react";

interface Props {
  orgId: string;
}

const useOrganizationMutations = () => {
  const createOrg = api.organization.create.useMutation();

  return {
    createOrg,
  };
};

export default useOrganizationMutations;
