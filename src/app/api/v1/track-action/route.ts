
import { NextRequest } from "next/server";
import { blinkEvents } from '~/server/db/schema';
import { db } from '~/server/db';
import { EventType, ErrorMsg } from '~/enums'
import { isAuthorized, createBlinkId, handleError, getBlink, extractUrlFromActionUrl } from '~/lib/api-helpers';


/**
 * Insert an interaction event into the database.
 * @param id 
 * @param orgId 
 * @param url 
 * @param userPubKey 
 */
async function insertActionEvent(id: string, orgId: string, url: string, userPubKey: string | null){

    const result = await getBlink(id);

    // Add event to blink events table
    if(result[0]?.orgId !== orgId){
       throw new Error(ErrorMsg.INVALID_FIELD);
    }

    await db.insert(blinkEvents).values({eventType: EventType.INTERACTION, orgId, blinkId: id, url: url, payerPubKey: userPubKey});
}


export const POST = async (
    request: NextRequest) => {
        try {
            const authHeader = request.headers.get('Authorization');
            const body = await request.json();

            const { blinkUrl, payerPubKey, requestUrl } = body;

            const url = extractUrlFromActionUrl(blinkUrl);
            

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
