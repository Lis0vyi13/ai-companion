import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.D_ID_API_KEY;

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!apiKey) {
    return NextResponse.json({ error: "D-ID API key not set" }, { status: 500 });
  }

  const { id } = await params;

  try {
    const response = await fetch(`https://api.d-id.com/agents/${id}/chat`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || "Failed to create chat");
    }

    return NextResponse.json(data);
  } catch (err) {
    const error =
      typeof err === "object" && err && "message" in err ? err : { message: "Unknown error" };

    return NextResponse.json({ error }, { status: 500 });
  }
}
