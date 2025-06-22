// file: lib/actions.js
"use server";

import prisma from "./prisma";
import bcrypt from "bcryptjs";
import { signOut, auth } from "@/auth";
import { add } from "date-fns";
import stringSimilarity from "string-similarity";

// --- NORMALIZAÇÃO (Sem alterações) ---
function normalizeNome(nome) {
  if (!nome) return "";
  return nome
    .toLowerCase()
    .replace(/dr\.?|dra\.?|doutor(a)?/gi, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
function normalizeEspecialidade(especialidade) {
  if (!especialidade) return "";
  return especialidade
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// --- OUTRAS FUNÇÕES (Sem alterações) ---
export async function registerPatient(data) { /* ... seu código aqui ... */ }
export async function registerMedic(data) { /* ... seu código aqui ... */ }
export async function handleLogout() { await signOut(); }


// -------------------- AGENDAMENTO COM DEPURAÇÃO EXTENSIVA ------------------

export async function verificarDisponibilidade(criteria) {
  console.log("Backend: Verificando disponibilidade com critérios:", criteria);

  try {
    let medicos = [];
    // ... (sua lógica de fuzzy match)
    if (criteria.nome_medico) {
        const todosMedicos = await prisma.medico.findMany({ where: { ativo: true } });
        const nomes = todosMedicos.map(m => normalizeNome(m.nome));
        const nomeBusca = normalizeNome(criteria.nome_medico);
        const { bestMatch, bestMatchIndex } = stringSimilarity.findBestMatch(nomeBusca, nomes);

        if (bestMatch.rating >= 0.7) {
            medicos.push(todosMedicos[bestMatchIndex]);
        } else if (bestMatch.rating > 0.45) {
            return { disponivel: false, motivo: "Confirmação necessária", precisaConfirmar: "medico", sugestoes: [todosMedicos[bestMatchIndex]?.nome] };
        } else {
            return { disponivel: false, motivo: "Nenhum médico encontrado com esse nome." };
        }
    } else if (criteria.especialidade) {
        // ... (lógica de especialidade)
    }

    if (medicos.length === 0) return { disponivel: false, motivo: "Nenhum médico encontrado." };

    const dataHoraDesejada = new Date(`${criteria.data}T${criteria.hora}:00.000-03:00`);
    if (isNaN(dataHoraDesejada.getTime())) return { disponivel: false, motivo: "Formato de data ou hora inválido." };

    for (const medico of medicos) {
      const disponibilidade = await prisma.disponibilidadeMedico.findFirst({
        where: {
          medicoId: medico.id,
          diaSemana: dataHoraDesejada.getDay(),
          horaInicio: { lte: dataHoraDesejada },
          horaFim: { gt: dataHoraDesejada },
        },
      });

      if (!disponibilidade) continue;

      // [CORREÇÃO APLICADA AQUI]
      const bloqueio = await prisma.bloqueioAgenda.findFirst({
        where: {
          medicoId: medico.id,
          dataInicio: { lte: dataHoraDesejada }, // de data_inicio para dataInicio
          dataFim: { gte: dataHoraDesejada },    // de data_fim para dataFim
        },
      });
      if (bloqueio) continue;
      
      const duracaoConsulta = 30;
      const dataHoraFimDesejada = add(dataHoraDesejada, { minutes: duracaoConsulta });

      const consultaConflitante = await prisma.consulta.findFirst({
        where: {
          medicoId: medico.id,
          status: { notIn: ["cancelada"] },
          dataHora: { lt: dataHoraFimDesejada },
          dataHoraFim: { gt: dataHoraDesejada },
        },
      });

      if (!consultaConflitante) {
        return {
          disponivel: true,
          motivo: `Horário encontrado com ${medico.nome} em ${dataHoraDesejada.toLocaleString('pt-BR')}.`,
          proximaAcao: {
            funcao: "confirmar_agendamento_consulta",
            argumentos: {
              medicoId: medico.id,
              dataHora: dataHoraDesejada.toISOString(),
            }
          }
        };
      }
    }
    return {
      disponivel: false,
      motivo: "O horário solicitado não está disponível.",
    };
  } catch (error) {
    console.error("ERRO CRÍTICO NA FUNÇÃO verificarDisponibilidade:", error);
    return { disponivel: false, motivo: "Ocorreu um erro interno." };
  }
}












export async function confirmarAgendamento(details) {
  console.log("\n============== INICIANDO confirmarAgendamento ==============");
  console.log("[DEPURAÇÃO] Detalhes recebidos para confirmação:", details);
  
  const session = await auth();
  console.log("[DEPURAÇÃO] Sessão do usuário obtida:", session ? { user: session.user } : null);

  if (!session || session.user.role !== "paciente") {
    console.error("❌ FALHA DE AUTORIZAÇÃO: Usuário não é um 'paciente' ou não está logado.");
    console.log("============== FINALIZANDO confirmarAgendamento COM FALHA ==============");
    return { success: false, message: "Apenas pacientes logados podem agendar." };
  }
  
  let { medicoId, dataHora } = details;
  medicoId = parseInt(medicoId, 10);
  console.log(`[DEPURAÇÃO] medicoId (após parseInt): ${medicoId}, dataHora: ${dataHora}`);

  if (isNaN(medicoId)) {
      console.error("❌ ERRO: medicoId não é um número válido.");
      return { success: false, message: "ID do médico inválido." };
  }

  const medicoExists = await prisma.medico.findUnique({ where: { id: medicoId } });
  console.log("[DEPURAÇÃO] Verificação de existência do médico (ID:", medicoId, "):", medicoExists ? "Encontrado" : "NÃO Encontrado");
  
  if (!medicoExists) {
    console.error("❌ ERRO: Médico com ID", medicoId, "não encontrado no banco de dados.");
    return { success: false, message: "Médico não encontrado no sistema." };
  }

  try {
    const dadosParaCriar = {
        pacienteId: parseInt(session.user.id),
        medicoId: medicoId,
        dataHora: new Date(dataHora),
        dataHoraFim: add(new Date(dataHora), { minutes: 30 }),
        status: "agendada",
        duracaoMinutos: 30,
    };
    
    console.log("[DEPURAÇÃO] --> EXECUTANDO prisma.consulta.create com os dados:", JSON.stringify(dadosParaCriar, null, 2));
    
    const novaConsulta = await prisma.consulta.create({
      data: dadosParaCriar,
    });

    console.log("✅ !!! SUCESSO: Consulta criada no banco de dados com ID:", novaConsulta.id);
    console.log("============== FINALIZANDO confirmarAgendamento COM SUCESSO ==============");
    return { success: true, message: "Consulta agendada com sucesso!" };

  } catch (error) {
    console.error("❌ ERRO AO TENTAR CRIAR A CONSULTA NO BANCO:", error);
    console.log("============== FINALIZANDO confirmarAgendamento COM ERRO ==============");
    return { success: false, message: `Erro do servidor: ${error.message}` };
  }
}