import { db } from '~/server/db';
import { organizations, blinks } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { createHash } from 'crypto';
import { ErrorMsg } from '~/enums/errors';
import { LinkedAction } from '@solana/actions';

export const splitIdentityKeyFromUrl = (actionUrl: string) => {

    const url = new URL(actionUrl);
    const searchParams = url.searchParams;
    let actionIdentityKey = searchParams.get('actionId');

    return {path: url.pathname, actionIdentityKey};
}

export const removeSearchParams = (url: string) => {

    //remove search param from requestUrl
    const questionMarkIndex = url.indexOf('?'); 

    // const path = link.pathname;
    if (questionMarkIndex === -1) {
        return url;
    }

    return url.substring(0, questionMarkIndex);
}

export const extractUrlFromActionUrl = (actionUrl: string) => {
    const decodedBlinkUrl = decodeURIComponent(actionUrl);
            const splitted = decodedBlinkUrl?.split('solana-action:');
            const length = splitted?.length;
            const url = splitted?.length && splitted.length > 1 ? splitted[length-1] : null;

            return url;
}

const matchActionPath = (actionPath: string, basePath: string) => {

    let path = actionPath;
    if(actionPath.includes('http')){
        // Extract the pathname from the actionPath
        const url = new URL(actionPath);
        path = url.pathname;
    }

    // Replace all placeholders with a regex pattern that matches any valid path segment
    const dynamicPath = basePath.replace(/\{[^}]+\}/g, '[^/]+'); // Matches any character except '/'
    
    // Create a regex pattern with case insensitivity
    const regex = new RegExp(`^${dynamicPath}$`, 'i'); // 'i' for case insensitive
    return regex.test(path);
};

export const getBlinkId = async (path: string, actionIdentifier: string) => {

    // get all blink events for the given actionIdentityKey
    const events = await db.query.blinkEvents.findMany({
        where: (blinkEvents, {eq}) => eq(blinkEvents.actionIdentityKey, actionIdentifier)
    });

    // get all blink ids from the events
    const ids = events.map((evnet) => evnet.blinkId);

    // remove search params from the path
    const cleanedPath = removeSearchParams(path);

    // get all blinks from the ids
    const blinks = await db.query.blinks.findMany({
        where: (blink, {inArray}) => inArray(blink.id, ids)
    })

    let idFound = false;

    for(const blink of blinks){
        const actions: LinkedAction[] = blink.actions as LinkedAction[];
        for(const action of actions){
            const match = matchActionPath(cleanedPath, action.href);
            if(match){
                idFound = true;
                return blink.id;
            }
        }
    }

    if(!idFound){
        throw new Error('Could not find blink id for the given action. Action Url: '+path);
    }

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

    // if(url === null){
    //     throw new Error(ErrorMsg.UNAUTHORIZED);
    // }

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
            return new Response(JSON.stringify({ error }), {
                status: 400,
            });
        case ErrorMsg.INVALID_FIELD:
            return new Response(JSON.stringify({ error }), {
                status: 400,
            });
        default:
            return new Response(JSON.stringify({ error }), {
                status: 500,
            });
    }
}
