import { error } from 'console';
import { ACTION } from 'next/dist/client/components/app-router-headers';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { blinks, organizations } from '~/server/db/schema';

export const POST = async (request: NextRequest) => {
    try{
        // const authHeader = request.headers.get('Authorization');
        // if(!authHeader || !authHeader.startsWith('Bearer ')){
        //     return new NextResponse(JSON.stringify({error: 'Unauthorized'}), {status: 401});
        // }

        await db.insert(organizations).values({
            name: 'Example Corp',
            email: 'hello@examplecorp.com'
        })

        // const token = authHeader.split(' ')[1];
        // let decodedToken;


        console.log('gm!');


        return Response.json({}, {
            status:200,
        })
    }catch (error) {
        console.error("Error in POST /api/swaps/jupiter:", error);
        return new Response(JSON.stringify({ error }), {
      status: 500,
    });
  }
};