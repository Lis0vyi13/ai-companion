import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiKey = process.env.D_ID_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "D-ID API key not set" }, { status: 500 });
  }

  try {
    const id = req.nextUrl.searchParams.get("id");
    console.log("Fetching talk status for ID:", id);

    const response = await fetch(`https://api.d-id.com/talks/${id}`, {
      headers: {
        Authorization: `Basic ${apiKey}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    const error =
      typeof err === "object" && err && "message" in err ? err : { message: "Unknown error" };
    return NextResponse.json({ error }, { status: 500 });
  }
}
