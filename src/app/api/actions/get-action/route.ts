import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ACTIONS_CORS_HEADERS } from "@solana/actions";
import { BlinksightsClient } from "blinksights-sdk";
import { ActionGetResponse } from "@solana/actions";

const client = new BlinksightsClient(process.env.BLINKSIGHTS_API_KEY!, "http://localhost:3000");

export async function GET(req: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), "data", "actionData.json");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "No action data found" },
        { status: 404 },
      );
    }

    const data = fs.readFileSync(filePath, "utf-8");
    const dataJson = JSON.parse(data);


    const blinksightsAction = await client.createActionGetResponseV2(req.url, dataJson);
    console.log('blinksightsAction ::::::: ', blinksightsAction);
    console.log('blinksightsAction links ::::::: ', blinksightsAction.links);

    return NextResponse.json(blinksightsAction, {
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
