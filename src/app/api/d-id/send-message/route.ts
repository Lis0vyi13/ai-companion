import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.D_ID_API_KEY;

export async function POST(req: NextRequest) {
  if (!apiKey) {
    return NextResponse.json({ error: "D-ID API key not set" }, { status: 500 });
  }

  try {
    const { agent_id, chat_id, streamId, message, sessionId } = await req.json();

    const response = await fetch(`https://api.d-id.com/agents/${agent_id}/chat/${chat_id}`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId,
        streamId,
        messages: [{ content: message, role: "user", created_at: new Date().toISOString() }],
      }),
    });

    const data = await response.json();
    console.log("D-ID API response:", data);
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to send talk" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error calling D-ID API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
