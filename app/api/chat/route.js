// /app/api/chat/route.js

import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});


const buildGoogleGenAIPrompt = (messages, mode) => {
  let systemPrompt = `Você é a assistente virtual, Brailinho, do site BrailleWay. A plataforma tem o intuito de disponibilidar
  telemedicina para todas as pessoas, mas com foco especial naqueles que possuem deficiência visual. Pode responder perguntas não relacionadas ao site também.`;

  if (mode === "paciente") {
    systemPrompt +=
      " O usuário está autenticado como paciente. Ajude-o a consultar seus próprios dados e a agendar consultas.";
  } else if (mode === "medico") {
    systemPrompt +=
      " O usuário está autenticado como médico. Responda questões apenas sobre seus próprios dados e consultas.";
  }

  return [{ role: "system", content: systemPrompt }, ...messages];
};

export async function POST(request) {
  const requestBody = await request.json();

  const messages = requestBody.messages || [];
  const modelId = requestBody.model;

  const session = await auth();

  let mode = "basico";
  if (session?.user?.role === "paciente") mode = "paciente";
  else if (session?.user?.role === "medico") mode = "medico";

  if (mode === "paciente") {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser && /agendar/.test(lastUser.content.toLowerCase())) {
      const when = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await prisma.consulta.create({
        data: {
          pacienteId: Number(session.user.id),
          medicoId: 1,
          dataHora: when,
        },
      });
      messages.push({
        role: "system",
        content: `O paciente acabou de agendar uma consulta para ${when.toISOString()}. Confirme o agendamento.`,
      });
    }
  }

  const stream = await streamText({
    model: google(modelId || "gemini-2.5-flash-preview-05-20"),
    messages: buildGoogleGenAIPrompt(messages, mode),
    temperature: 1,
  });

  return stream.toDataStreamResponse();
}
