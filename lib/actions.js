// =============================
// lib/actions.js
// =============================

"use server";

import prisma from "./prisma";
import bcrypt from "bcryptjs";
import { signOut, auth } from "@/auth";
import { add, isBefore, isAfter } from "date-fns";
import stringSimilarity from "string-similarity";

/*  NOVO: dependências p/ fuso  */
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = "America/Sao_Paulo";

/* ----------  NOVOS HELPERS de data/hora  ---------- */
const toISOWithTimezone = (dateStr, hourStr) => {
  // dateStr: "2025-06-30"  |  hourStr: "10:00"
  return dayjs
    .tz(`${dateStr} ${hourStr}`, "YYYY-MM-DD HH:mm", TZ)
    .toISOString(); // inclui o offset (-03:00) automaticamente
};

const ensureTimezoneOffset = (iso) =>
  /Z$|[+-]\d{2}:\d{2}$/.test(iso) ? iso : `${iso}-03:00`;

const parseDateTimeWithTimezone = (dateStr, hourStr) => {
  // Converte data/hora para Date object preservando timezone
  return dayjs.tz(`${dateStr} ${hourStr}`, "YYYY-MM-DD HH:mm", TZ).toDate();
};
/* -------------------------------------------------- */

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
// 🧑‍⚕️ REGISTER FUNCTIONS
// -----------------------------------------------------------------------------
export async function registerPatient(data) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    const paciente = await prisma.paciente.create({
      data: {
        nome: data.name,
        email: data.email,
        telefone: data.phone || "",
        dataNascimento: data.birthDate ? new Date(data.birthDate) : new Date(),
        genero: data.gender || "Prefiro_nao_informar",
        senha: hashedPassword,
      },
    });

    return { success: true, message: "Paciente cadastrado com sucesso!" };
  } catch (error) {
    console.error("Erro ao cadastrar paciente:", error);
    if (error.code === "P2002") {
      return { success: false, message: "Email já está em uso." };
    }
    return { success: false, message: "Erro ao cadastrar paciente." };
  }
}

export async function registerMedic(data) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    // Criar o médico
    const medico = await prisma.medico.create({
      data: {
        nome: data.name,
        email: data.email,
        telefone: data.phone || "",
        crm: data.crm,
        especialidadeId: parseInt(data.specialtyId),
        senha: hashedPassword,
      },
    });

    // Processar disponibilidades se fornecidas
    if (data.disponibilidades) {
      const disponibilidades = JSON.parse(data.disponibilidades);
      
      for (const disponibilidade of disponibilidades) {
        if (disponibilidade.ativa) {
          await prisma.disponibilidadeMedico.create({
            data: {
              medicoId: medico.id,
              diaSemana: disponibilidade.diaSemana,
              horaInicio: new Date(`1970-01-01T${disponibilidade.horaInicio}:00`),
              horaFim: new Date(`1970-01-01T${disponibilidade.horaFim}:00`),
              disponivel: true,
            },
          });
        }
      }
    }

    return { success: true, message: "Médico cadastrado com sucesso!" };
  } catch (error) {
    console.error("Erro ao cadastrar médico:", error);
    if (error.code === "P2002") {
      if (error.meta?.target?.includes("email")) {
        return { success: false, message: "Email já está em uso." };
      }
      if (error.meta?.target?.includes("crm")) {
        return { success: false, message: "CRM já está em uso." };
      }
    }
    return { success: false, message: "Erro ao cadastrar médico." };
  }
}

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

    // 📅 Parsing data/hora com timezone correto
    const dataHoraDesejada = parseDateTimeWithTimezone(criteria.data, criteria.hora);
    console.log(`[TIMEZONE DEBUG] Input: ${criteria.data} ${criteria.hora}`);
    console.log(`[TIMEZONE DEBUG] Parsed: ${dataHoraDesejada.toISOString()}`);
    console.log(`[TIMEZONE DEBUG] Local: ${dataHoraDesejada.toLocaleString('pt-BR', { timeZone: TZ })}`);
    
    if (isNaN(dataHoraDesejada.getTime())) return { disponivel: false, motivo: "Data ou hora inválida." };
    if (isBefore(dataHoraDesejada, new Date()))
      return { disponivel: false, motivo: "Não é possível agendar no passado." };

    const dataHoraFim = add(dataHoraDesejada, { minutes: 30 });

    // 0 = Domingo, 6 = Sábado – ajustado de acordo com o schema atual do banco
    const diaSemana = dataHoraDesejada.getDay();

    for (const medico of medicos) {
      console.log(`[CHECK] Médico #${medico.id} (${medico.nome})`);

      // Disponibilidade na grade semanal
      // Extrair apenas a hora da data desejada para comparar com horaInicio/horaFim
      const horaDesejada = new Date(`1970-01-01T${dataHoraDesejada.getHours().toString().padStart(2, '0')}:${dataHoraDesejada.getMinutes().toString().padStart(2, '0')}:00`);
      
      const disponibilidade = await prisma.disponibilidadeMedico.findFirst({
        where: {
          medicoId: medico.id,
          diaSemana,
          horaInicio: { lte: horaDesejada },
          horaFim: { gt: horaDesejada },
        },
      });
      if (!disponibilidade) {
        console.log(`   ↪️  Fora do horário de atendimento (diaSemana=${diaSemana}, hora=${horaDesejada.toTimeString().slice(0,5)})`);
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

    // A string de data/hora (details.dataHora) já vem no formato ISO com o fuso correto.
    // O construtor `new Date()` é a forma padrão e correta de processá-la.
    const inicio = new Date(details.dataHora);
    
    console.log(`[TIMEZONE DEBUG] confirmarAgendamento - Input: ${details.dataHora}`);
    console.log(`[TIMEZONE DEBUG] confirmarAgendamento - Final ISO: ${inicio.toISOString()}`);
    
    if (isNaN(inicio.getTime())) return { success: false, message: "dataHora inválido." };
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

export async function getConsultasUsuario() {
  console.log("\n========= getConsultasUsuario =========");
  try {
    const session = await auth();
    if (!session || !session.user) {
      return [];
    }

    let consultas = [];
    if (session.user.role === "paciente") {
      const pacienteId = Number(session.user.id);
      if (!Number.isInteger(pacienteId)) {
        console.error("Paciente ID inválido na sessão:", session.user.id);
        return [];
      }
      consultas = await prisma.consulta.findMany({
        where: {
          pacienteId: pacienteId,
          status: 'agendada',
          dataHora: { gte: new Date() },
        },
        include: {
          medico: { include: { especialidade: true } },
          paciente: true,
        },
        orderBy: { dataHora: 'asc' },
      });
    } else if (session.user.role === "medico") {
      const medicoId = Number(session.user.id);
      if (!Number.isInteger(medicoId)) {
        console.error("Médico ID inválido na sessão:", session.user.id);
        return [];
      }
      consultas = await prisma.consulta.findMany({
        where: {
          medicoId: medicoId,
          status: 'agendada',
          dataHora: { gte: new Date() },
        },
        include: {
          paciente: true,
          medico: { include: { especialidade: true } },
        },
        orderBy: { dataHora: 'asc' },
      });
    } else {
      return [];
    }
    console.log(`[SUCESSO] Foram encontradas ${consultas.length} consultas para o usuário #${session.user.id} (${session.user.role})`);
    return consultas;
  } catch (err) {
    console.error("BRAILINHO ❌ Erro em getConsultasUsuario:", err);
    return [];
  }
}