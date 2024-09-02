import { NextRequest } from 'next/server';
import { isAuthorized, splitIdentityKeyFromUrl, handleError, getBlink, getBlinkId } from '~/lib/api-helpers';
import { blinkEvents } from '~/server/db/schema';
import { EventType } from '~/enums/events';
import { db } from '~/server/db';
import { ErrorMsg } from '~/enums/errors';

async function insertActionIdentiyInfo(id: string, orgId: string, url: string, actionIdentityKey: string, memo: string, userPubKey: string){

  const result = await getBlink(id);
  // Add event to blink events table
  if(result[0]?.orgId === orgId){
    await db.insert(blinkEvents).values({
      eventType: EventType.PENDING, 
      orgId, blinkId: id, 
      url: url, 
      actionIdentityKey: actionIdentityKey,
      memo: memo,
      payerPubKey: userPubKey
    });
  }
}

export const POST = async (
  request: NextRequest) => {
    try{
        const authHeader = request.headers.get('Authorization');
        const body = await request.json();
        const { memo, payerPubKey, requestUrl } = body;
        // const url = extractUrlFromActionUrl(blinkUrl);

        const org = await isAuthorized(authHeader, null);
        const { path, actionIdentityKey } = splitIdentityKeyFromUrl(requestUrl);

        // Create blink id
        // const hash = createBlinkId(url!, org[0]!.id);
        const blinkId = await getBlinkId(requestUrl, actionIdentityKey!);
        if(!blinkId){
          return handleError(new Error(ErrorMsg.REF_NOT_FOUND));
        }

        await insertActionIdentiyInfo(blinkId, org[0]!.id, path, actionIdentityKey!, memo, payerPubKey);

        return Response.json({}, {
            status:200,
        })
    }catch (error: any) {
      console.error('Error in POST /api/v2/track-transaction', 
        {
            message: error.message
        });
      return handleError(error);
    }
};