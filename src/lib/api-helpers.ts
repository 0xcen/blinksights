import { db } from '~/server/db';
import { organizations, blinks } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { createHash } from 'crypto';
import { ErrorMsg } from '~/enums/errors';


export const extractUrlFromActionUrl = (actionUrl: string) => {
    const decodedBlinkUrl = decodeURIComponent(actionUrl);
            const splitted = decodedBlinkUrl?.split('solana-action:');
            console.log(splitted);
            const length = splitted?.length;
            const url = splitted?.length && splitted.length > 1 ? splitted[length-1] : null;

            return url;
}

/**
 * Fetch organization.
 * @param apiKey 
 * @returns organization
 */
async function getOrg(apiKey: string){

    const result = await db.select().from(organizations).where(eq(organizations.apiKey, apiKey));
    return result;
}

/**
 * Fetch blink.
 * @param id 
 * @returns blink
 * @throws REF_NOT_FOUND if the blink does not exist.
 */
export async function getBlink(id: string){
    const result = await db.select().from(blinks).where(eq(blinks.id, id));

    if(!result || result.length === 0){
        throw new Error(ErrorMsg.REF_NOT_FOUND);
    }

    return result;
}

/**
 * Check if authHeader is valid and the user is authorized to access the API. 
 * @param authHeader 
 * @returns organization
 * @throws Unauthorized if the user is not authorized to access the API.
 */
export async function isAuthorized(authHeader: string | null, url: string | null) {
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new Error(ErrorMsg.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];
    if(!token){
        throw new Error(ErrorMsg.UNAUTHORIZED);
    }

    const org = await getOrg(token);
    if(!org || org.length === 0){
        throw new Error(ErrorMsg.UNAUTHORIZED);
    }

    if(url === null){
        throw new Error(ErrorMsg.UNAUTHORIZED);
    }

    return org;
}

/**
 * Create a blink id for the given url and orgId.
 * @param url 
 * @param orgId 
 * @returns blink id
 */
export function createBlinkId(url: string, orgId: string){
    return createHash('sha256').update(url+orgId).digest('hex');
}

/**
 * Handle the error and return the appropriate response.
 * @param error 
 * @returns response
 */
export function handleError(error: any){
    switch(error.message){
        case ErrorMsg.UNAUTHORIZED:
            return new Response(JSON.stringify({ error }), {
                status: 401,
            });
        case ErrorMsg.REF_NOT_FOUND:
            console.log(error);
            return new Response(JSON.stringify({ error }), {
                
                status: 400,
            });
        case ErrorMsg.INVALID_FIELD:
            console.log(error);
            return new Response(JSON.stringify({ error }), {
                status: 400,
            });
        default:
            return new Response(JSON.stringify({ error }), {
                status: 500,
            });
    }
}
