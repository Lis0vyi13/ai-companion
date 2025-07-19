import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.D_ID_API_KEY;

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!apiKey) {
    return NextResponse.json({ error: "D-ID API key not set" }, { status: 500 });
  }

  try {
    const { id } = await params;
    const session_id = req.nextUrl.searchParams.get("session_id");

    console.log(id, "Session ID from query params");
    const response = await fetch(`https://api.d-id.com/talks/streams/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error }, { status: response.status });
    }
    console.log("Session deleted successfully:", id);
    return NextResponse.json({ message: "Session deleted" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
