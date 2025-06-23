// =============================
// lib/actions.js
// =============================

"use server";

import prisma from "./prisma";
import bcrypt from "bcryptjs";
import { signOut, auth } from "@/auth";
import { add, isBefore, isAfter } from "date-fns";
import stringSimilarity from "string-similarity";

// -----------------------------------------------------------------------------
// 🔧 HELPERS – Normalização
// -----------------------------------------------------------------------------
const normalizeNome = (n) =>
  (n || "")
    .toLowerCase()
    .replace(/dr\.?(a)?|doutor(a)?/gi, "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();

const normalizeEspecialidade = (e) =>
  (e || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();

// -----------------------------------------------------------------------------
// 🧑‍⚕️ REGISTER FUNCTIONS (sem alterações relevantes para este debug)
// -----------------------------------------------------------------------------
export async function registerPatient(data) { /* ... */ }
export async function registerMedic(data) { /* ... */ }
export async function handleLogout() { await signOut(); }

// -----------------------------------------------------------------------------
// 🔎 verificarDisponibilidade – agora com logs detalhados & correções
// -----------------------------------------------------------------------------
export async function verificarDisponibilidade(criteria) {
  console.log("\n========= BRAILINHO.verificarDisponibilidade =========");
  console.log("[INPUT] criteria:", JSON.stringify(criteria));

  try {
    // 🚦 Validação rápida de entrada
    if (!criteria?.data || !criteria?.hora) {
      return { disponivel: false, motivo: "Data e hora são obrigatórias." };
    }

    // 🔄 Seleção de médicos por nome ou especialidade
    let medicos = [];
    if (criteria.nome_medico) {
      const todosMedicos = await prisma.medico.findMany({ where: { ativo: true } });
      const nomesNormalizados = todosMedicos.map((m) => normalizeNome(m.nome));
      const buscaNome = normalizeNome(criteria.nome_medico);
      const { bestMatch, bestMatchIndex } = stringSimilarity.findBestMatch(buscaNome, nomesNormalizados);

      console.log(`[MATCH] Melhor correspondência: '${todosMedicos[bestMatchIndex]?.nome}' (score ${bestMatch.rating})`);

      if (bestMatch.rating >= 0.7) {
        medicos.push(todosMedicos[bestMatchIndex]);
      } else if (bestMatch.rating > 0.45) {
        return {
          disponivel: false,
          motivo: "Confirmação necessária",
          precisaConfirmar: "medico",
          sugestoes: [todosMedicos[bestMatchIndex]?.nome],
        };
      } else {
        return { disponivel: false, motivo: "Nenhum médico encontrado com esse nome." };
      }
    } else if (criteria.especialidade) {
      const esp = normalizeEspecialidade(criteria.especialidade);
      medicos = await prisma.medico.findMany({
        where: {
          ativo: true,
          especialidade: { contains: esp, mode: "insensitive" },
        },
      });
      if (medicos.length === 0) {
        return { disponivel: false, motivo: "Nenhum médico com essa especialidade." };
      }
    }

    if (medicos.length === 0) return { disponivel: false, motivo: "Nenhum médico encontrado." };

    // 📅 Parsing data/hora
    const dataHoraDesejada = new Date(`${criteria.data}T${criteria.hora}:00-03:00`); // TZ fixado America/Sao_Paulo
    if (isNaN(dataHoraDesejada)) return { disponivel: false, motivo: "Data ou hora inválida." };
    if (isBefore(dataHoraDesejada, new Date()))
      return { disponivel: false, motivo: "Não é possível agendar no passado." };

    const dataHoraFim = add(dataHoraDesejada, { minutes: 30 });

    // 0 = Domingo, 6 = Sábado – ajustado de acordo com o schema atual do banco
    const diaSemana = dataHoraDesejada.getDay(); // Ajusta para 0 = segunda (caso banco use iso)

    for (const medico of medicos) {
      console.log(`[CHECK] Médico #${medico.id} (${medico.nome})`);

      // Disponibilidade na grade semanal
      const disponibilidade = await prisma.disponibilidadeMedico.findFirst({
        where: {
          medicoId: medico.id,
          diaSemana,
          horaInicio: { lte: dataHoraDesejada },
          horaFim: { gt: dataHoraDesejada },
        },
      });
      if (!disponibilidade) {
        console.log(`   ↪️  Fora do horário de atendimento (diaSemana=${diaSemana})`);
        continue;
      }

      // Bloqueios manuais
      const bloqueio = await prisma.bloqueioAgenda.findFirst({
        where: {
          medicoId: medico.id,
          dataInicio: { lte: dataHoraDesejada },
          dataFim: { gte: dataHoraDesejada },
        },
      });
      if (bloqueio) {
        console.log("   ↪️  Horário bloqueado pelo médico.");
        continue;
      }

      // Conflito com outras consultas
      const conflito = await prisma.consulta.findFirst({
        where: {
          medicoId: medico.id,
          status: { notIn: ["cancelada"] },
          dataHora: { lt: dataHoraFim },
          dataHoraFim: { gt: dataHoraDesejada },
        },
      });
      if (conflito) {
        console.log("   ↪️  Conflito com consulta #" + conflito.id);
        continue;
      }

      // ✅ Disponível!
      console.log("   ✅  Horário livre!");
      return {
        disponivel: true,
        motivo: `Horário encontrado com ${medico.nome} em ${dataHoraDesejada.toLocaleString("pt-BR")}.`,
        proximaAcao: {
          funcao: "confirmar_agendamento_consulta",
          argumentos: { medicoId: medico.id, dataHora: dataHoraDesejada.toISOString() },
        },
      };
    }

    console.log("   ❌  Nenhum médico disponível no horário solicitado.");
    return { disponivel: false, motivo: "O horário solicitado não está disponível." };
  } catch (err) {
    console.error("BRAILINHO ❌ Erro em verificarDisponibilidade:", err);
    return { disponivel: false, motivo: "Erro interno." };
  }
}

// -----------------------------------------------------------------------------
// ✅ confirmarAgendamento – melhorias & logs adicionais
// -----------------------------------------------------------------------------
export async function confirmarAgendamento(details) {
  console.log("\n========= BRAILINHO.confirmarAgendamento =========");
  console.log("[INPUT] details:", JSON.stringify(details));

  try {
    const session = await auth();
    if (!session || session.user.role !== "paciente") {
      return { success: false, message: "Apenas pacientes logados podem agendar." };
    }

    const pacienteId = Number(session.user.id);
    if (!Number.isInteger(pacienteId)) {
      console.error("Paciente ID inválido na sessão:", session.user.id);
      return { success: false, message: "Sessão inválida." };
    }

    const medicoId = Number(details.medicoId);
    if (!Number.isInteger(medicoId)) return { success: false, message: "ID do médico inválido." };

    const medico = await prisma.medico.findUnique({ where: { id: medicoId } });
    if (!medico) return { success: false, message: "Médico não encontrado." };

    const inicio = new Date(details.dataHora);
    if (isNaN(inicio)) return { success: false, message: "dataHora inválido." };
    if (isBefore(inicio, new Date())) return { success: false, message: "Não é possível agendar no passado." };

    const fim = add(inicio, { minutes: 30 });

    // Verifica novamente conflito (race condition)
    const conflito = await prisma.consulta.findFirst({
      where: {
        medicoId,
        status: { notIn: ["cancelada"] },
        dataHora: { lt: fim },
        dataHoraFim: { gt: inicio },
      },
    });
    if (conflito) return { success: false, message: "Horário acabou de ser ocupado. Tente outro." };

    const consulta = await prisma.consulta.create({
      data: {
        pacienteId,
        medicoId,
        dataHora: inicio,
        dataHoraFim: fim,
        status: "agendada",
        duracaoMinutos: 30,
      },
    });

    console.log("[SUCESSO] Consulta criada:", consulta.id);
    return { success: true, message: "Consulta agendada com sucesso!", consultaId: consulta.id };
  } catch (err) {
    console.error("BRAILINHO ❌ confirmarAgendamento erro:", err);
    return { success: false, message: "Erro do servidor." };
  } finally {
    // Importante em edge/funcões serverless: fechar conexões.
    try {
      await prisma.$disconnect();
    } catch {}
  }
}