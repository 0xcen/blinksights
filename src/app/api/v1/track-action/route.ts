
import { NextRequest, NextResponse } from "next/server";
import { blinkEvents, blinks } from '~/server/db/schema';
import { db } from '~/server/db';
import {eq} from 'drizzle-orm';
import { EventType } from '~/enums/events'
import { isAuthorized, createBlinkId, handleError } from '~/lib/api-helpers';

/**
 * Insert an interaction event into the database.
 * @param id 
 * @param orgId 
 * @param url 
 * @param userPubKey 
 */
async function insertActionEvent(id: string, orgId: string, url: string, userPubKey: string | null){

    const result = await db.select().from(blinks).where(eq(blinks.id, id));

    if(!result || result.length === 0){
        return new NextResponse(JSON.stringify({error: 'Unauthorized'}), {status: 401});
    }

    if(result[0]?.orgId === orgId){
        await db.insert(blinkEvents).values({eventType: EventType.INTERACTION, orgId, blinkId: id, url: url, payerPubKey: userPubKey});
    }
}

export const POST = async (
    request: NextRequest) => {
        try {
            const authHeader = request.headers.get('Authorization');
            const body = await request.json();

            const { blinkUrl, payerPubKey, requestUrl } = body;

            const decodedBlinkUrl = decodeURIComponent(blinkUrl);
            const splitted = decodedBlinkUrl?.split('solana-action:');
            console.log(splitted);
            const length = splitted?.length;
            const url = splitted?.length && splitted.length > 1 ? splitted[length-1] : null;

            const org = await isAuthorized(authHeader, url!);

            const hash = createBlinkId(url!, org[0]!.id);

            insertActionEvent(hash, org[0]!.id, requestUrl, payerPubKey);

            return Response.json({}, {
                status:200,
            })

        }catch (error: any) {
            return handleError(error);
        }
};
