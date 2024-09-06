import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ACTIONS_CORS_HEADERS } from "@solana/actions";
import { BlinksightsClient } from "blinksights-sdk";

const client = new BlinksightsClient(process.env.BLINKSIGHTS_API_KEY!, "http://localhost:3000");

export async function POST(req: NextRequest) {
  try {
    const { actionUrl } = await req.json();

    client.trackActionV2('123-test-pubkey', actionUrl);

    return NextResponse.json({}, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (error) {
    console.error("Error reading action data:", error);
    return NextResponse.json(
      { error: "Failed to read action data" },
      { status: 500 },
    );
  }
}