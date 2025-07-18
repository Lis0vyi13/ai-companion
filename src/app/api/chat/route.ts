import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: "You are a helpful assistant." }, ...messages],
    });

    const reply = completion.choices?.[0]?.message?.content ?? "";

    return NextResponse.json({ reply });
  } catch (err) {
    const error =
      typeof err === "object" && err && "message" in err ? err : { message: "Unknown error" };
    return NextResponse.json({ error: "Groq API error", details: error }, { status: 500 });
  }
}
