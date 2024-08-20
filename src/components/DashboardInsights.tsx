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
// TODO: refactor!!!!! (AllBlinkEventsChart)
interface BlinkViewsChartProps {
    orgId: string;
    timeRanges: string[];
}

const renderRow = (path: string, eventCount: number, blinkId: string) => {
    const router = useRouter();

    return (
        <TableRow onClick={() => {
            router.push(`/blinks/${blinkId}`);
        }}>
            <TableCell>
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

const renderHighlightTable = (blinks: { event: BlinkEvent; eventCount: number; viewCount: number; interactionCount: number; }[], type: EventType | null, title: string, description: string) => {
    
    return (
        <Card className="w-full">
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
                    {blinks.map(({event, eventCount, interactionCount, viewCount}) => {
                        switch(type){
                            case EventType.INTERACTION:
                                return renderRow(event.url ? event.url : event.id, interactionCount, event.blinkId);
                            case EventType.RENDER:
                                return renderRow(event.url ? event.url : event.id, viewCount, event.blinkId);
                            default:
                                return renderRow(event.url ? event.url : event.id, eventCount, event.blinkId);
                        }
                    })}
                </TableBody>
                </Table>
                {blinks.length > 0 ? null : <NoDataAvailable />}
            </CardContent>
        </Card>
    )
}

const sortAndCountEvents = (events: BlinkEvent[]) => {
    const sortedEvents: { event: BlinkEvent; eventCount: number; viewCount: number; interactionCount: number; }[] = [];

    events.forEach((event: BlinkEvent) => {
        const found = sortedEvents.find((e: { event: BlinkEvent; eventCount: number; viewCount: number; interactionCount: number; }) => e.event.blinkId === event.blinkId);
        let interactionCount = 0;
        let viewCount = 0;

        if(event.eventType === EventType.RENDER){
            viewCount += 1;
        } else if (event.eventType === EventType.INTERACTION){
            interactionCount += 1;
        }

        if (found) {
            found.eventCount += 1;
            found.viewCount += viewCount;
            found.interactionCount += interactionCount;

            if (event.url){
                found.event.url = event.url;
            }
        } else {
            
            sortedEvents.push({event, eventCount: 1, viewCount, interactionCount});
        }
    });

    const descSortedEvents = [...sortedEvents].sort((a, b) => b.eventCount - a.eventCount);
    const descSortedViews = [...sortedEvents].sort((a, b) => b.viewCount - a.viewCount);
    const descSortedInteractions = [...sortedEvents].sort((a, b) => b.interactionCount - a.interactionCount);   

    return {descSortedEvents, descSortedInteractions, descSortedViews};
}

export const DashboardInsights: React.FC<BlinkViewsChartProps> = ({
    orgId,
    timeRanges
}) =>{
    const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">(
        timeRanges[0] as "24h" | "7d" | "30d",
    );
    const analytics = useAllBlinkEvents(orgId, timeRange);
    const {descSortedEvents, descSortedInteractions, descSortedViews} = sortAndCountEvents(analytics.data?.events || []);

    return (
        <div className="grid w-full gap-6">
            {renderHighlightTable(descSortedEvents.slice(0, 5), null, "Most Events", "Best performing Blinks in terms of any event type")}
            <div className="flex w-full gap-4">
                {renderHighlightTable(descSortedInteractions, EventType.INTERACTION, "Most Interactions", "Blinks that got the most interactions") }
                {descSortedEvents.length > 0 && renderHighlightTable(descSortedViews, EventType.RENDER, "Most Views", "Blinks that got the most views")}
            </div>
        </div>
    )
}
