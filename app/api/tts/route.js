import { NextResponse } from "next/server";

export async function POST(request) {
  const { text, languageCode = "pt-BR", voiceName = "pt-BR-Neural2-A" } = await request.json();

  const apiKey = process.env.GOOGLE_TTS_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Google TTS key not configured" }, { status: 500 });
  }

  const body = {
    input: { text },
    voice: { languageCode, name: voiceName },
    audioConfig: { audioEncoding: "MP3" },
  };

  const resp = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}` , {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const result = await resp.json();

  if (!resp.ok) {
    return NextResponse.json(result, { status: resp.status });
  }

  return NextResponse.json({ audioContent: result.audioContent });
}

