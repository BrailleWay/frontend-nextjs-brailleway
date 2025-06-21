// /app/api/chat/route.js

import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { auth } from "@/auth";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});


const buildGoogleGenAIPrompt = (messages, role) => {
  let systemPrompt = `Você é a assistente virtual, Brailinho, do site BrailleWay. A plataforma tem o intuito de disponibilidar
  telemedicina para todas as pessoas, mas com foco especial naqueles que possuem deficiência visual. Pode responder perguntas não relacionadas ao site também.`;

  if (role === "paciente") {
    systemPrompt +=
      " O usuário está autenticado como paciente. Ajude-o a consultar seus próprios dados e a agendar consultas.";
  } else if (role === "medico") {
    systemPrompt +=
      " O usuário está autenticado como médico. Responda questões apenas sobre seus próprios dados e consultas.";
  }

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

  const session = await auth();
  const role = session?.user?.role;

  const stream = await streamText({
    model: google(modelId || "gemini-2.5-flash-preview-05-20"),
    messages: buildGoogleGenAIPrompt(messages, role),
    temperature: 1,
  });

  return stream.toDataStreamResponse();
}
