import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { BlinkEvent } from "./../types/tableTypes"
import { EventType } from "./../enums/index"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sortStats = (data: BlinkEvent[]) => {
  const {views, interactions} = data.reduce<{views: BlinkEvent[], interactions: BlinkEvent[]}>(
    (acc, item) => {
      switch (item.eventType) {
        case EventType.RENDER:
          acc.views.push(item);
          break;
        case EventType.INTERACTION:
          acc.interactions.push(item);
          break;
      }
      return acc; // Return the accumulator
    },
    {views: [], interactions: []} // Initialize the accumulator with two empty arrays
  );

  return {views: { label: "Views", data: views}, interactions: {label: "Interactions", data: interactions}};
};
