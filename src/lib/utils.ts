import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { BlinkEvent } from "./../types/tableTypes"
import { EventType } from "./../enums/index"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sortStats = (data: BlinkEvent[]) => {
  const {views, interactions, confirmations} = data.reduce<{views: BlinkEvent[], interactions: BlinkEvent[], confirmations: BlinkEvent[]}>(
    (acc, item) => {
      switch (item.eventType) {
        case EventType.RENDER:
          acc.views.push(item);
          break;
        case EventType.INTERACTION:
          acc.interactions.push(item);
          acc.views.push(item);
          break;
        case EventType.CONFIRMED:
          acc.confirmations.push(item);
          acc.interactions.push(item);
          acc.views.push(item);
          break;
        case EventType.CANCELLED:
          acc.interactions.push(item);
          acc.views.push(item);
          break;
      }
      return acc; // Return the accumulator
    },
    {views: [], interactions: [], confirmations: []} // Initialize the accumulator with two empty arrays
  );

  return {views: { label: "Views", data: views}, interactions: {label: "Interactions", data: interactions}, confirmations: {label: "Confirmations", data: confirmations}};
};

export const mapTimeRangeToDays = (timeRange: string): number => {
  switch (timeRange) {
    case "24h":
      return 1;
    case "7d":
      return 7;
    case "30d":
      return 30;
    default:
      return 7;
  }
}
