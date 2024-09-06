import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { BlinkEvent } from "./../types/tableTypes"
import { EventType } from "./../enums/index"
import { BlinkWithOrg } from "../types/actions"

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

export const sortBlinksByDevAndProd = (blinks: BlinkWithOrg[]) => {
  const devBlinks: BlinkWithOrg[] = [];
  const prodBlinks: BlinkWithOrg[] = [];

  blinks.forEach(blink => {
      if (blink.url.includes("localhost")) {
          devBlinks.push(blink);
      } else {
          prodBlinks.push(blink);
      }
  });

  return { devBlinks, prodBlinks };
}

export const filterEventsByDevAndProd = (devMode: boolean, events: BlinkEvent[], devBlinks: BlinkWithOrg[], prodBlinks: BlinkWithOrg[]) => {
  if(devMode && events){
      return events.filter((event: BlinkEvent) => devBlinks.some(blink => blink.id === event.blinkId));
  } else if (events){
      return events.filter((event: BlinkEvent) => prodBlinks.some(blink => blink.id === event.blinkId));
  }else{
      return [];
  } 
}
