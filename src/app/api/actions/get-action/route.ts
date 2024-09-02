import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ACTIONS_CORS_HEADERS } from "@solana/actions";

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
    return NextResponse.json(JSON.parse(data), {
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
