// /app/api/chat/route.js

import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
// import { prisma } from "@/lib/prisma";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});


const buildGoogleGenAIPrompt = (messages) => {
  const systemPrompt = `Você é a assistente virtual, Brailinho, do site BrailleWay. A plataforma tem o intuito de disponibilidar 
  telemedicina para todas as pessoas, mas com foco especial naqueles que possuem deficiência visual.`;
  return [{ role: "system", content: systemPrompt }, ...messages];
};

export async function POST(request) {
  const requestBody = await request.json();

  // (Opcional) Log para depuração
  console.log(
    "BACKEND LOG: Corpo da Requisição Recebido:",
    JSON.stringify(requestBody, null, 2)
  );

  // 2. Extraia os dados DIRETAMENTE do corpo da requisição, pois a estrutura é plana.
  const messages = requestBody.messages || [];
  const modelId = requestBody.model;

  const stream = await streamText({
    model: google(modelId || "gemini-2.0-flash"),
    messages: buildGoogleGenAIPrompt(messages),
    temperature: 1,
  });

  return stream.toDataStreamResponse();
}
