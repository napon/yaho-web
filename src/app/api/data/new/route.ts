import { NextRequest, NextResponse } from "next/server";

const URL = process.env.INGEST_WEBHOOK_URL;

// This route is used to generate the structured product data
export async function POST(req: NextRequest) {
  const { path } = await req.json();
  if (!URL) {
    return NextResponse.json(
      { error: "INGEST_WEBHOOK_URL is not set" },
      { status: 500 }
    );
  }
  try {
    await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: `yaho-tw/${path}` }),
    });
    return NextResponse.json({ message: "Data received" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to refresh data" },
      { status: 500 }
    );
  }
}
