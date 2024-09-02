
import { NextRequest } from "next/server";
import { blinkEvents } from '~/server/db/schema';
import { db } from '~/server/db';
import { EventType, ErrorMsg } from '~/enums'
import { isAuthorized, handleError, getBlinkId, splitIdentityKeyFromUrl } from '~/lib/api-helpers';

/**
 * Insert an interaction event into the database.
 * @param id 
 * @param orgId 
 * @param url 
 * @param userPubKey 
 */
async function insertActionEvent(id: string, orgId: string, url: string, userPubKey: string | null, actionIdentityKey: string){
    
    await db.insert(blinkEvents).values({eventType: EventType.INTERACTION, orgId, blinkId: id, url: url, payerPubKey: userPubKey, actionIdentityKey});
}

export const POST = async (
    request: NextRequest) => {
        try {
            const authHeader = request.headers.get('Authorization');
            const body = await request.json();
            
            const { payerPubKey, requestUrl } = body;

            const { actionIdentityKey, path } = splitIdentityKeyFromUrl(requestUrl);
            const org = await isAuthorized(authHeader, null);
            if(actionIdentityKey === null){
                return handleError(new Error(ErrorMsg.REF_NOT_FOUND));
            }
            
            const blinkId = await getBlinkId(path, actionIdentityKey);
            
            if(!blinkId){
                return handleError(new Error(ErrorMsg.REF_NOT_FOUND));
            }
            
            insertActionEvent(blinkId, org[0]!.id, path, payerPubKey, actionIdentityKey);

            return Response.json({}, {
                status:200,
            })

        }catch (error: any) {
            console.error('Error in POST /api/v2/track-action', 
                {
                    message: error.message,
                });
            return handleError(error);
        }
};
