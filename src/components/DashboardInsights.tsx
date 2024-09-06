"use client"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import useAllBlinkEvents from "~/hooks/useAllBlinkEvents"
import { BlinkEvent } from "~/types/tableTypes"
import { EventType } from "~/enums/index"
import NoDataAvailable from "./NoDataAvailable"
import { useRouter } from "next/navigation"
import { BlinkViewsChartProps } from "~/types/tableTypes"
import { useDevModeStore } from "~/store/devModeStore";
import useAllBlinks from "~/hooks/useAllBlinks";
import { sortBlinksByDevAndProd, filterEventsByDevAndProd } from "~/lib/utils";
import { BlinkWithOrg } from "~/types/actions"

type BlinkWithCount = {event: BlinkEvent, eventCount: number, viewCount: number, interactionCount: number, confirmationsCount: number, blinkUrl: string}

const renderRow = (path: string, eventCount: number, blinkId: string) => {
    const router = useRouter();

    return (
        <TableRow onClick={() => {
            router.push(`/blinks/${blinkId}`);
        }}>
            <TableCell className="break-all">
                <div className="font-medium">{path}</div>
            </TableCell>
            <TableCell>
                <div className="text-right">
                    {eventCount}
                </div>
            </TableCell>
        </TableRow>
    )
}

const renderTableHeader = (headers: {label: string, hidden: boolean}[]) => {
    const length = headers.length;

    return (
        <TableHeader>
            {headers.map((header, index) => (
                <TableHead key={header.label} className={`${header.hidden ? "hidden xl:table-column" : ""} ${index === length - 1 ? "text-right" : ""}`}>{header.label}</TableHead>
            ))}
        </TableHeader>
    )
}

const headers = [
    {label: "Blink Url", hidden: false},
    {label: "Event Count", hidden: false},
]

const renderHighlightTable = (blinks: BlinkWithCount[], type: EventType | null, title: string, description: string) => {
    
    return (
        <Card className="s">
            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    {description}
                </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                {renderTableHeader(headers)} 
                <TableBody>
                    {blinks.map((event: BlinkWithCount) => {
                        switch(type){
                            case EventType.INTERACTION:
                                return renderRow(event.blinkUrl ? event.blinkUrl : event.event.id, event.interactionCount, event.event.blinkId);
                            case EventType.RENDER:
                                return renderRow(event.blinkUrl ? event.blinkUrl : event.event.id, event.viewCount, event.event.blinkId);
                            case EventType.CONFIRMED:
                                return renderRow(event.blinkUrl ? event.blinkUrl : event.event.id, event.confirmationsCount, event.event.blinkId);
                            default:
                                return renderRow(event.blinkUrl ? event.blinkUrl : event.event.id, event.eventCount, event.event.blinkId);
                        }
                    })}
                </TableBody>
                </Table>
                {blinks.length > 0 ? null : <NoDataAvailable />}
            </CardContent>
        </Card>
    )
}

const sortAndCountEvents = (events: BlinkEvent[], devMode: boolean) => {
    const sortedEvents: {event: BlinkEvent, eventCount: number, viewCount: number, interactionCount: number, confirmationsCount: number}[] = [];

    events.forEach((event: BlinkEvent) => {
        const found = sortedEvents.find((e: { event: BlinkEvent; eventCount: number; viewCount: number; interactionCount: number; confirmationsCount: number; }) => e.event.blinkId === event.blinkId);
        let interactionCount = 0;
        let viewCount = 0;
        let confirmationsCount = 0;

        if(event.eventType === EventType.RENDER){
            viewCount += 1;
        } else if (event.eventType === EventType.INTERACTION){
            interactionCount += 1;
        } else if (event.eventType === EventType.CONFIRMED){
            confirmationsCount += 1;
        }

        if (found) {
            found.eventCount += 1;
            found.viewCount += viewCount;
            found.interactionCount += interactionCount;
            found.confirmationsCount += confirmationsCount;
            if (event.url){
                found.event.url = event.url;
            }
        } else {
            
            sortedEvents.push({event, eventCount: 1, viewCount, interactionCount, confirmationsCount});
        }
    });

    const descSortedEvents = [...sortedEvents].sort((a, b) => b.eventCount - a.eventCount);
    const descSortedViews = [...sortedEvents].sort((a, b) => b.viewCount - a.viewCount);
    const descSortedInteractions = [...sortedEvents].sort((a, b) => b.interactionCount - a.interactionCount);
    const descSortedConfirmations = [...sortedEvents].sort((a, b) => b.confirmationsCount - a.confirmationsCount);

    return {descSortedEvents, descSortedInteractions, descSortedViews, descSortedConfirmations};
}

const getBlinkWithCount = (blinks: { event: BlinkEvent; eventCount: number; viewCount: number; interactionCount: number; confirmationsCount: number; }[], devMode: boolean, devBlinks: BlinkWithOrg[], prodBlinks: BlinkWithOrg[]) => {
    
    return blinks.map((event) => {
        if(devMode){
            const blink = devBlinks.find((blink) => blink.id === event.event.blinkId);
            return {...event, blinkUrl: blink?.url}
        } else {
            const blink = prodBlinks.find((blink) => blink.id === event.event.blinkId);
            return {...event, blinkUrl: blink?.url}
        }
    }) as BlinkWithCount[];
}

export const DashboardInsights: React.FC<BlinkViewsChartProps> = ({
    orgId,
    timeRanges
}) =>{
    const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">(
        timeRanges[0] as "24h" | "7d" | "30d",
    );
    const analytics = useAllBlinkEvents(orgId, timeRange);  
    const blinks = useAllBlinks(orgId); // TODO: its limited to 50 blinks fix it
    const {devBlinks, prodBlinks} = sortBlinksByDevAndProd(blinks.data?.blinks || []);
    const devMode = useDevModeStore((state) => state.devMode);
    const filteredEvents = filterEventsByDevAndProd(devMode, analytics.data?.events ?? [], devBlinks, prodBlinks);

    const {descSortedEvents, descSortedInteractions, descSortedViews, descSortedConfirmations} = sortAndCountEvents(filteredEvents, devMode);
    const blinkWithCountEvents = getBlinkWithCount(descSortedEvents, devMode, devBlinks, prodBlinks);
    const blinkWithCountViews = getBlinkWithCount(descSortedViews, devMode, devBlinks, prodBlinks);
    const blinkWithCountInteractions = getBlinkWithCount(descSortedInteractions, devMode, devBlinks, prodBlinks);
    const blinkWithCountConfirmations = getBlinkWithCount(descSortedConfirmations, devMode, devBlinks, prodBlinks);
    // const blinkWithCountViews = descSortedViews.map((event) => ({...event, blinkUrl: event.event.url})) as BlinkWithCount[];
    // const blinkWithCountInteractions = descSortedInteractions.map((event) => ({...event, blinkUrl: event.event.url})) as BlinkWithCount[];
    // const blinkWithCountConfirmations = descSortedConfirmations.map((event) => ({...event, blinkUrl: e.url})) as BlinkWithCount[];

    return (
        <div className="grid w-full gap-6">
            <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
                {renderHighlightTable(blinkWithCountEvents.slice(0, 5), null, "Most Events", "Best performing Blinks in terms of any event type")}
                {renderHighlightTable(blinkWithCountViews.slice(0, 5), EventType.RENDER, "Most Views", "Blinks that got the most views")}
            </div>
            <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
                {renderHighlightTable(blinkWithCountInteractions.slice(0, 5), EventType.INTERACTION, "Most Interactions", "Blinks that got the most interactions") }
                {renderHighlightTable(blinkWithCountConfirmations.slice(0, 5), EventType.CONFIRMED, "Most Conversions", "Blinks that got the most conversions")}
            </div>
        </div>
    )
}
