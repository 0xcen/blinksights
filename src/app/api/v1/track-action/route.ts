
import { NextRequest, NextResponse } from "next/server";
import { blinkEvents, blinks, organizations } from '~/server/db/schema';
import { createHash } from "crypto";
import { db } from '~/server/db';
import {eq} from 'drizzle-orm';
import { EventType } from './../../../../enums/events'

async function insertActionEvent(id: string, orgId: string, params: string, url: string, userPubKey: string | null){

    const result = await db.select().from(blinks).where(eq(blinks.id, id));

    if(!result || result.length === 0){
        return new NextResponse(JSON.stringify({error: 'Unauthorized'}), {status: 401});
    }

    if(result[0]?.orgId === orgId){
        await db.insert(blinkEvents).values({eventType: EventType.INTERACTION, orgId, blinkId: id, path: url, userPubKey: userPubKey, params: params});
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
        try {
            const authHeader = request.headers.get('Authorization');
            const body = await request.json();

            const { referer, params, pubKey, requestUrl } = body;

            const splitted = referer?.split('solana-action:');
            const length = splitted?.length;
            const url = splitted?.length && splitted.length > 1 ? splitted[length-1] : null;
            
            if(!authHeader || !authHeader.startsWith('Bearer ')){
                return new NextResponse(JSON.stringify({error: 'Unauthorized'}), {status: 401});
            }

            const token = authHeader.split(' ')[1];
            if(!token){
                return new NextResponse(JSON.stringify({error: 'Unauthorized'}), {status: 401});
            }

            const org = await getOrg(token);
            if(!org || org.length === 0){
                return new NextResponse(JSON.stringify({error: 'Unauthorized'}), {status: 401});
            }

            const hash = createHash('sha256').update(url+org[0]!.id).digest('hex');

            insertActionEvent(hash, org[0]!.id, params, requestUrl, pubKey);

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
