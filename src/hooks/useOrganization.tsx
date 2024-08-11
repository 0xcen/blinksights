"use client";
import { api } from "../trpc/react";

const useOrganization = () => {
  return api.organization.get.useQuery();
};

export default useOrganization;
