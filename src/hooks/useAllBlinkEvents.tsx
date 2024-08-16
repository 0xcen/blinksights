import { api } from "../trpc/react";

const useAllBlinkEvents = (
  orgId: string,
  timeRange: "24h" | "7d" | "30d" = "30d",
) => {
  return api.blink.getAllEvents.useQuery({ orgId, timeRange });
};

export default useAllBlinkEvents;
