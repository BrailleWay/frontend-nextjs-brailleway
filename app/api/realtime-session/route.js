// file: app/api/realtime-session/route.js

import { NextResponse } from 'next/server';

export async function GET() {
  const openAIKey = process.env.OPENAI_API_KEY;

  if (!openAIKey) {
    return NextResponse.json(
      { error: "A chave da API da OpenAI não está configurada no servidor." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview",
        voice: "verse",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro da API da OpenAI ao criar sessão:", errorData);
      return NextResponse.json(
        { error: "Falha ao criar sessão com a OpenAI.", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Envia o client_secret (chave efêmera) para o frontend
    return NextResponse.json(data);

  } catch (error) {
    console.error("Erro interno do servidor ao criar sessão realtime:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}