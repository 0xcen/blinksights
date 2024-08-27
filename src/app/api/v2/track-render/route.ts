import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { blinkEvents, blinks, organizations } from '~/server/db/schema';
import {eq} from 'drizzle-orm';
import { EventType } from './../../../../enums/events'
import { ActionGetResponse } from '@solana/actions';
import { isAuthorized, getBlinkId, handleError, createBlinkId, splitIdentityKeyFromUrl } from '~/lib/api-helpers';
import { ErrorMsg } from '~/enums/errors';

/**
 * Checks if blink already exists in db and creates it if not.
 * @param id: hashed blink url
 * @param orgId: organization id
 * @param action: blink action object
 * @param url: url
 */
async function insertRenderEvent(id: string, orgId: string, action: ActionGetResponse, path: string, actionIdentifier: string){

  const result = await db.select().from(blinks).where(eq(blinks.id, id));
  let newBlink = false;

  // If blink doesn't exist, create it
  if(!result || result.length === 0){
    newBlink = true;
    await db.insert(blinks).values({id, orgId, actions: action.links?.actions, title: action.title, description: action.description, label: action.label, icon: action.icon, url: path }); 
  }
  
  // Add event to blink events table
  if(result[0]?.orgId === orgId || newBlink){
    await db.insert(blinkEvents).values({eventType: EventType.RENDER, orgId, blinkId: id, url: path, actionIdentityKey: actionIdentifier});
  } 
}

export const POST = async (
  request: NextRequest) => {
    try{
        const authHeader = request.headers.get('Authorization');
        const body = await request.json();

        const { url, payerPubKey, actionIdentifier } = body;
        
        const org = await isAuthorized(authHeader, url);
        const action = body.action as ActionGetResponse;
        let { actionIdentityKey, path } = splitIdentityKeyFromUrl(url);

        let hash = '';
        

        if(!actionIdentityKey){
          hash = createBlinkId(path, org[0]!.id);
          actionIdentityKey = actionIdentifier;
        } else {
          const id = await getBlinkId(path, actionIdentityKey);
          if(!id){
            return handleError(new Error(ErrorMsg.REF_NOT_FOUND));
          }
          hash = id;
        }
        
        await insertRenderEvent(hash, org[0]!.id, action, url, actionIdentityKey!); 

        return Response.json({}, {
            status:200,
        })
    }catch (error: any) {
      return handleError(error);
    }
};