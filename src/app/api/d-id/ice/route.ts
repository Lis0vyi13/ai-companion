import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.D_ID_API_KEY;

export async function POST(req: NextRequest) {
  if (!apiKey) {
    return NextResponse.json({ error: "D-ID API key not set" }, { status: 500 });
  }

  try {
    const { agent_id, stream_id, candidate, sdpMid, sdpMLineIndex, session_id } = await req.json();

    const response = await fetch(
      `https://api.d-id.com/agents/${agent_id}/streams/${stream_id}/ice`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidate,
          sdpMid,
          sdpMLineIndex,
          session_id,
          agent_id,
          stream_id,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || "Failed to send ICE candidate");
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to send ICE candidate:", err);
    return NextResponse.json(
      { error: (err as Error)?.message || "Unknown error" },
      { status: 500 },
    );
  }
}
