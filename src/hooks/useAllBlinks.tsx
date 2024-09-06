import { api } from "../trpc/react";

const useAllBlinks = (orgId: string, page: number = 1, pageSize: number = 50) => {
  return api.blink.all.useQuery({ page, pageSize, orgId } as { page?: number; pageSize?: number; orgId: string });
};

export default useAllBlinks;