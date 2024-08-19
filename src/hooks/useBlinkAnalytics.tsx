import { api } from "../trpc/react";

const useBlinkAnalytics = (
  id: string,
  timeRange: "24h" | "7d" | "30d" = "30d",
) => {
  return api.blink.getBlinkAnalytics.useQuery({ id, timeRange });
};

export default useBlinkAnalytics;
