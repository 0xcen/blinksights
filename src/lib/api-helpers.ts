import { db } from '~/server/db';
import { organizations } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { createHash } from 'crypto';

/**
 * Check if apiKey exists and returns the organization if so. 
 */
async function getOrg(apiKey: string){

    const result = await db.select().from(organizations).where(eq(organizations.apiKey, apiKey));
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
        throw new Error('Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    if(!token){
        throw new Error('Unauthorized');
    }

    const org = await getOrg(token);
    if(!org || org.length === 0){
        throw new Error('Unauthorized');
    }

    if(url === null){
        throw new Error('Unauthorized');
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
        case 'Unauthorized':
            return new Response(JSON.stringify({ error }), {
                status: 401,
            });
        default:
            return new Response(JSON.stringify({ error }), {
                status: 500,
            });
    }
}
