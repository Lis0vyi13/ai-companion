import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.D_ID_API_KEY;

export async function DELETE(req: NextRequest) {
  if (!apiKey) {
    return NextResponse.json({ error: "D-ID API key not set" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { streamId, sessionId, agentId } = body;

    const response = await fetch(`https://api.d-id.com/agents/${agentId}/streams/${streamId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error }, { status: response.status });
    }
    return NextResponse.json({ message: "Session deleted" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
