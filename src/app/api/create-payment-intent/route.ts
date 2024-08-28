import { NextRequest, NextResponse } from "next/server";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
export const POST = async (
    request: NextRequest) => {
  if (request.method === 'POST') {
    try {
      // Assuming the amount is passed in the request body, you can also hardcode it if needed
      const { amount } = await request.json();

      // Create a Payment Intent with the specified amount
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount || 1099, // Amount in cents
        currency: 'usd',
        // Optionally, you can add metadata, customer ID, etc.
      });

      // Send the clientSecret to the client
      return NextResponse.json({ paymentIntent: paymentIntent }, {
        status:200,
      });
    } catch (error) {
      console.error('Error creating Payment Intent:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, {
        status:500,
      });
    }
  } else {
    // Handle non-POST requests
    return NextResponse.json({ error: 'Method Not Allowed' }, {
      status:405,
    });
  }
}
