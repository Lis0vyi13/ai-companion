import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.D_ID_API_KEY;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!apiKey) {
    return NextResponse.json({ error: "D-ID API key not set" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { session_id } = body;
    const { id } = await params;

    const response = await fetch(`https://api.d-id.com/talks/streams/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        script: {
          type: "text",
          provider: { type: "microsoft", voice_id: "Sara" },
          input: "why you are so beautiful",
        },
        audio_optimization: "2",
        session_id,
        driver_url: "bank://lively",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || "Failed to create talk");
    }

    return NextResponse.json(data);
  } catch (err) {
    const error =
      typeof err === "object" && err && "message" in err ? err : { message: "Unknown error" };

    return NextResponse.json({ error }, { status: 500 });
  }
}
