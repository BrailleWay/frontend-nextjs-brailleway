import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.formData();
  const file = data.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Audio file missing" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_SPEECH_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Google STT key not configured" }, { status: 500 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const audioContent = buffer.toString("base64");

  const body = {
    config: {
      encoding: "WEBM_OPUS",
      languageCode: "pt-BR",
    },
    audio: {
      content: audioContent,
    },
  };

  const resp = await fetch(
    `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const result = await resp.json();

  if (!resp.ok) {
    return NextResponse.json(result, { status: resp.status });
  }

  const text = result.results?.[0]?.alternatives?.[0]?.transcript || "";

  return NextResponse.json({ text });
}

