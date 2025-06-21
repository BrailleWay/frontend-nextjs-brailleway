import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.formData();
  const file = data.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Audio file missing" }, { status: 400 });
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("model", "whisper-1");
  formData.append("language", "pt");

  const resp = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${openaiKey}` },
    body: formData,
  });

  const result = await resp.json();

  if (!resp.ok) {
    return NextResponse.json(result, { status: resp.status });
  }

  return NextResponse.json({ text: result.text });
}

