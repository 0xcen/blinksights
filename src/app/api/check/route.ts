import { NextRequest, NextResponse } from "next/server";
import { db } from '~/server/db';
import { EventType } from '~/enums/events';
import { blinkEvents } from '~/server/db/schema';
import { eq } from "drizzle-orm";
import { Connection, PublicKey, ConfirmedSignatureInfo } from "@solana/web3.js";
import { BlinkEvent } from "~/types/tableTypes"; 

const CONFIMATIONS_STATS = [
    'processed',
    'confirmed',
    'finalized'
]

async function fetchMemosForAddress(address: string) {

    const connection = new Connection(`https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`); 

    const sigs = await connection.getSignaturesForAddress(new PublicKey(address));

    const memoSigs = sigs.filter((sig) => sig.memo !== null);

    return memoSigs;
}

async function matchAndUpdateEvents (events: BlinkEvent[], memos: ConfirmedSignatureInfo[]) {
    for (const event of events) { 
        const memo = memos.find(entry => entry.memo!.includes(event.memo!));

        if(memo) {
            if (memo.err){
                await db.update(blinkEvents).set({eventType: EventType.FAILED}).where(eq(blinkEvents.id, event.id));
            } else if (memo.confirmationStatus && CONFIMATIONS_STATS.includes(memo.confirmationStatus)){
                await db.update(blinkEvents).set({eventType: EventType.CONFIRMED}).where(eq(blinkEvents.id, event.id));
            } 
        } else {
            if(isExpired(event.timestamp)) {
                await db.update(blinkEvents).set({eventType: EventType.CANCELLED}).where(eq(blinkEvents.id, event.id));
            }
        }
    }
}

function isExpired(timestamp: Date) {
    const currentDate = new Date();

    const diff = currentDate.getTime() - timestamp.getTime();

    const fourMin = 4 * 60 * 1000;

    return diff > fourMin;
}

function sleep(ms: number) {
    return new Promise(resolve => {
        setTimeout(resolve, ms); // 60 seconds
    });
}

const sortByAddress = (events: BlinkEvent[]) => {
    const sortedEvents: { payerPubKey: string, events: BlinkEvent[] }[] = [];
    events.forEach(event => {
        if(!event.payerPubKey || !event.memo) {
            return;
        }

        const existing = sortedEvents.find(e => e.payerPubKey === event.payerPubKey);
        if(existing) {
            existing.events.push(event);
        } else {
            sortedEvents.push({ payerPubKey: event.payerPubKey!, events: [event] });
        }
    })

    return sortedEvents;
}

export const GET = async (
    request: NextRequest,
) => {
    const unconfirmedEvents = await db.select().from(blinkEvents).where(eq(blinkEvents.eventType, EventType.PENDING)) as BlinkEvent[];

    const sortedEvents = sortByAddress(unconfirmedEvents);

    // Process in batches of 10
    for (let i = 0; i < sortedEvents.length; i += 10) {
        const batch = sortedEvents.slice(i, i + 10); // Get the next batch of 10

        // Process each event in the batch
        for (const eventList of batch) {
            const memos = await fetchMemosForAddress(eventList.payerPubKey);
            await matchAndUpdateEvents(eventList.events, memos);
        }

        // Wait for 1 second after processing each batch
        await sleep(1000);
    }

    return NextResponse.json({}, { status: 200 });
}

export const OPTIONS = GET;