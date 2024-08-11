import { api } from "../trpc/react";

const useBlink = (id: string) => {
  return api.blink.get.useQuery({ id });
};

export default useBlink;
