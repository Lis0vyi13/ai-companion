import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.D_ID_API_KEY;

export async function POST(req: NextRequest) {
  if (!apiKey) {
    return NextResponse.json({ error: "D-ID API key not set" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { stream_id, answer, session_id } = body;

    const response = await fetch(`https://api.d-id.com/talks/streams/${stream_id}/sdp`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answer,
        session_id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || "Failed to create talk");
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Request failed:", err);

    const error = (err as Error)?.message || "Unknown error";
    return NextResponse.json({ error }, { status: 500 });
  }
}
