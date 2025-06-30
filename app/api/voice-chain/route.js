// ===== app/api/voice-chain/route.js =====
import { NextResponse } from "next/server";
import { verificarDisponibilidade, confirmarAgendamento } from "@/lib/actions";
import { tools } from "@/lib/assistantTools";
import { systemPrompt } from "@/lib/systemPrompt";

export async function POST(req) {
  const openAIKey = process.env.OPENAI_API_KEY;
  if (!openAIKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY não configurada." },
      { status: 500 }
    );
  }

  const form = await req.formData();
  const audio = form.get("audio");
  const messages = JSON.parse(form.get("messages") || "[]");

  if (!audio) {
    return NextResponse.json(
      { error: "Arquivo de áudio ausente." },
      { status: 400 }
    );
  }

  // -------- 1) Transcrição --------------------------------------------------
  const transFd = new FormData();
  transFd.append("file", audio, "audio.webm");
  transFd.append("model", "whisper-1");
  transFd.append("language", "pt");

  const transcriptRes = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${openAIKey}` },
      body: transFd,
    }
  );

  if (!transcriptRes.ok) {
    const err = await transcriptRes.json().catch(() => ({}));
    console.error("[voice‑chain] Falha na transcrição:", err);
    return NextResponse.json(
      { error: "Falha na transcrição." },
      { status: 500 }
    );
  }

  const { text: transcript } = await transcriptRes.json();
  if (!transcript.trim()) {
    return NextResponse.json({ transcript: "", messages, audio: null });
  }

  // -------- 2) Chat Completion --------------------------------------------
  messages.push({ role: "user", content: transcript });

  const chatBody = {
    model: "gpt-4o",
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    tools,
    tool_choice: "auto",
  };

  const completionRes = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIKey}`,
      },
      body: JSON.stringify(chatBody),
    }
  );

  if (!completionRes.ok) {
    const err = await completionRes.text();
    console.error("[voice‑chain] Falha no chat:", err);
    return NextResponse.json({ error: "Falha no chat" }, { status: 500 });
  }

  const completionData = await completionRes.json();
  let assistantMessage = completionData.choices[0].message;
  messages.push(assistantMessage);

  // -------- 3) Execução de Tool (se houver) --------------------------------
  if (assistantMessage.tool_calls?.length) {
    const toolCall = assistantMessage.tool_calls[0];
    const { name } = toolCall.function;
    const args = JSON.parse(toolCall.function.arguments || "{}");

    let toolOutput;
    try {
      if (name === "verificar_disponibilidade_medico") {
        toolOutput = await verificarDisponibilidade(args);
      } else if (name === "confirmar_agendamento_consulta") {
        toolOutput = await confirmarAgendamento(args);
      } else {
        toolOutput = { error: `Função '${name}' não implementada.` };
      }
    } catch (err) {
      toolOutput = { error: err.message };
    }

    messages.push({
      role: "tool",
      tool_call_id: toolCall.id,
      content: JSON.stringify(toolOutput),
    });

    // Segunda rodada após tool
    const secondRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAIKey}`,
        },
        body: JSON.stringify({
          ...chatBody,
          messages: [{ role: "system", content: systemPrompt }, ...messages],
        }),
      }
    );

    if (!secondRes.ok) {
      const err = await secondRes.text();
      console.error("[voice‑chain] Falha pós‑tool:", err);
      return NextResponse.json({ error: "Falha pós‑tool" }, { status: 500 });
    }
    const secondData = await secondRes.json();
    assistantMessage = secondData.choices[0].message;
    messages.push(assistantMessage);
  }

  // -------- 4) TTS ---------------------------------------------------------
  let audioBase64 = null;
  if (assistantMessage.content) {
    const ttsBody = {
      model: "tts-1",
      input: assistantMessage.content,
      voice: "nova",
    };
    const ttsRes = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIKey}`,
      },
      body: JSON.stringify(ttsBody),
    });

    if (ttsRes.ok) {
      const buf = Buffer.from(await ttsRes.arrayBuffer());
      audioBase64 = buf.toString("base64");
    } else {
      console.error("[voice‑chain] Falha no TTS:", await ttsRes.text());
    }
  }

  console.log("[voice-chain] TRANSCRIPT:", transcript);
  console.log(
    "[voice-chain] USER MSGS:",
    messages.filter((m) => m.role === "user").map((m) => m.content)
  );
  console.log("[voice-chain] ASSISTANT MSG:", assistantMessage.content);

  return NextResponse.json({
    transcript,
    messages,
    audio: audioBase64,
    assistantText: assistantMessage.content || "",
  });
}
