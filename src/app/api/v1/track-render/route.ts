import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { blinkEvents, blinks, organizations } from '~/server/db/schema';
import { createHash } from 'crypto';
import {eq} from 'drizzle-orm';
import { EventType } from './../../../../enums/events'

/**
 * Checks if blink already exists in db and creates it if not.
 * @param id: hashed blink url
 * @param orgId: organization id
 * @param action: blink action object
 * @param url: url
 */
async function insertRenderEvent(id: string, orgId: string, action: object, url: string){

  const result = await db.select().from(blinks).where(eq(blinks.id, id));
  let newBlink = false;

  if(!result || result.length === 0){
    newBlink = true;
    await db.insert(blinks).values({id, orgId, actions: action }); 
  }
  
  if(result[0]?.orgId === orgId || newBlink){
    // await db.insert(blinkEvents).values({eventType: EventType.RENDER, orgId, blinkId: id, path: url});
  }
}

/**
 * Check if apiKey exists and returns the organization if so. 
 */
async function getOrg(apiKey: string){

  const result = await db.select().from(organizations).where(eq(organizations.apiKey, apiKey));
  return result;
}

export const POST = async (
  request: NextRequest) => {
    try{
        const authHeader = request.headers.get('Authorization');
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return new NextResponse(JSON.stringify({error: 'Unauthorized'}), {status: 401});
        }

        const body = await request.json();
        const { url, action } = body;
        const hash = createHash('sha256').update(url).digest('hex');

        const token = authHeader.split(' ')[1];
        if(!token){
          return new NextResponse(JSON.stringify({error: 'Unauthorized'}), {status: 401});
        }

        const org = await getOrg(token);
        if(!org || org.length === 0){
          return new NextResponse(JSON.stringify({error: 'Unauthorized'}), {status: 401});
        }

        insertRenderEvent(hash, org[0]!.id, action, url);

        return Response.json({}, {
            status:200,
        })
    }catch (error) {
        console.error("Error in POST:", error);
        return new Response(JSON.stringify({ error }), {
      status: 500,
    });
  }
};