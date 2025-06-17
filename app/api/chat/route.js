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
  // 1. Leia o corpo da requisição UMA ÚNICA VEZ.
  const requestBody = await request.json();

  // (Opcional) Log para depuração
  console.log(
    "BACKEND LOG: Corpo da Requisição Recebido:",
    JSON.stringify(requestBody, null, 2)
  );

  // 2. Extraia os dados DIRETAMENTE do corpo da requisição, pois a estrutura é plana.
  const messages = requestBody.messages || [];
  const modelId = requestBody.model;

  // A correção robusta, lendo diretamente de requestBody
//   const userId = requestBody.userId || requestBody.userid;

//   console.log("BACKEND LOG: userId extraído:", userId); // Agora vai mostrar '4'

//   // 3. A validação agora vai funcionar como esperado.
//   if (!userId) {
//     console.error("BACKEND LOG: Validação falhou! userId não encontrado.");
//     return new Response("Erro: ID do usuário não fornecido.", { status: 400 });
//   }

//   // O resto do seu código para buscar posts e chamar a IA continua o mesmo...
//   let diaryContext = "O usuário ainda não possui anotações.";
//   try {
//     const posts = await prisma.post.findMany({
//       where: {
//         userId: Number(userId),
//       },
//       orderBy: {
//         createdAt: "asc",
//       },
//       select: {
//         descricao: true,
//         titulo: true,
//         date: true,
//         mood: true,
//       },
//     });

//     if (posts.length > 0) {
//       diaryContext = posts.map((post) => `Data do diário: ${post.date}, Humor do dia: ${post.mood}, Título do diário: ${post.titulo}, Descrição do diário: "${post.descricao}"`).join("\n");
//     }
//   } catch (error) {
//     console.error("Erro ao buscar posts no Prisma:", error);
//     diaryContext = "Ocorreu um erro ao tentar ler o diário.";
//   }

  const stream = await streamText({
    model: google(modelId || "gemini-2.0-flash"),
    messages: buildGoogleGenAIPrompt(messages),
    temperature: 1,
  });

  return stream.toDataStreamResponse();
}
