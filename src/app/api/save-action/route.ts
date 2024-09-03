import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { data } = await req.json();

    if (!data) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "data", "actionData.json");
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json(
      { message: "Action data saved successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error saving action data:", error);
    return NextResponse.json(
      { error: "Failed to save action data" },
      { status: 500 },
    );
  }
}
