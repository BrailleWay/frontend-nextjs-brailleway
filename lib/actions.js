// file: lib/actions.js

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
  const localDateTime = dayjs.tz(`${dateStr} ${hourStr}`, "YYYY-MM-DD HH:mm", TZ);
  return localDateTime.toISOString(); // inclui o offset (-03:00) automaticamente
};

const ensureTimezoneOffset = (iso) => {
  // Se já tem offset, retorna como está
  if (/Z$|[+-]\d{2}:\d{2}$/.test(iso)) {
    return iso;
  }
  
  // Se não tem offset, assume que é UTC e converte para local
  const utcDate = dayjs.utc(iso);
  return utcDate.tz(TZ).toISOString();
};

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
    // Validações no backend
    if (!data.name || !data.name.trim()) {
      return { success: false, message: "Nome é obrigatório." };
    }

    if (data.name.trim().length < 3) {
      return { success: false, message: "Nome deve ter pelo menos 3 caracteres." };
    }

    if (!data.email || !data.email.trim()) {
      return { success: false, message: "Email é obrigatório." };
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      return { success: false, message: "Email inválido." };
    }

    // Verificar se email já existe
    const existingPatient = await prisma.paciente.findUnique({
      where: { email: data.email.trim().toLowerCase() },
    });

    if (existingPatient) {
      return { success: false, message: "Este email já está cadastrado. Tente fazer login ou use outro email." };
    }

    // Validação de telefone (se fornecido)
    if (data.phone && data.phone.trim()) {
      const phoneRegex = /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/;
      if (!phoneRegex.test(data.phone.replace(/\D/g, ''))) {
        return { success: false, message: "Telefone inválido." };
      }
    }

    // Validação de data de nascimento
    if (!data.birthDate) {
      return { success: false, message: "Data de nascimento é obrigatória." };
    }

    const birthDate = new Date(data.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (isNaN(birthDate.getTime())) {
      return { success: false, message: "Data de nascimento inválida." };
    }

    if (age < 13) {
      return { success: false, message: "Você deve ter pelo menos 13 anos para se cadastrar." };
    }

    if (age > 120) {
      return { success: false, message: "Data de nascimento inválida." };
    }

    // Validação de gênero
    if (!data.gender) {
      return { success: false, message: "Selecione um gênero." };
    }

    const validGenders = ['M', 'F', 'Outro', 'Prefiro_nao_informar'];
    if (!validGenders.includes(data.gender)) {
      return { success: false, message: "Gênero inválido." };
    }

    // Validação de senha
    if (!data.password) {
      return { success: false, message: "Senha é obrigatória." };
    }

    if (data.password.length < 6) {
      return { success: false, message: "Senha deve ter pelo menos 6 caracteres." };
    }

    // Criar hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    // Criar o paciente
    const paciente = await prisma.paciente.create({
      data: {
        nome: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        telefone: data.phone ? data.phone.trim() : "",
        dataNascimento: birthDate,
        genero: data.gender,
        senha: hashedPassword,
        ativo: true,
      },
    });

    console.log(`[SUCESSO] Paciente cadastrado: ${paciente.email} (ID: ${paciente.id})`);
    return { 
      success: true, 
      message: "Cadastro realizado com sucesso! Você pode fazer login agora." 
    };
  } catch (error) {
    console.error("Erro ao cadastrar paciente:", error);
    
    // Tratamento específico de erros do Prisma
    if (error.code === "P2002") {
      if (error.meta?.target?.includes("email")) {
        return { success: false, message: "Este email já está cadastrado. Tente fazer login ou use outro email." };
      }
    }
    
    // Outros erros do Prisma
    if (error.code === "P2003") {
      return { success: false, message: "Dados inválidos fornecidos." };
    }
    
    return { success: false, message: "Erro interno do servidor. Tente novamente." };
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
      console.log('DISPONIBILIDADES RECEBIDAS:', disponibilidades);
      
      let disponibilidadesCriadas = 0;
      for (const disponibilidade of disponibilidades) {
        if (
          disponibilidade.ativa &&
          disponibilidade.diaSemana !== undefined &&
          !isNaN(parseInt(disponibilidade.diaSemana, 10))
        ) {
          await prisma.disponibilidadeMedico.create({
            data: {
              medicoId: medico.id,
              diaSemana: parseInt(disponibilidade.diaSemana, 10),
              horaInicio: new Date(`1970-01-01T${disponibilidade.horaInicio}:00Z`),
              horaFim: new Date(`1970-01-01T${disponibilidade.horaFim}:00Z`),
              disponivel: true,
            },
          });
          disponibilidadesCriadas++;
        }
      }
      
      console.log(`✅ Criadas ${disponibilidadesCriadas} disponibilidades para o médico ${medico.nome}`);
      
      if (disponibilidadesCriadas === 0) {
        console.warn(`⚠️ Médico ${medico.nome} cadastrado sem disponibilidades configuradas`);
      }
    } else {
      console.warn(`⚠️ Médico ${medico.nome} cadastrado sem disponibilidades`);
    }

    return { 
      success: true, 
      message: "Médico cadastrado com sucesso!" + 
        (data.disponibilidades ? " Lembre-se de configurar os horários de disponibilidade." : "")
    };
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

export async function handleLogout() { 
  await signOut(); 
}

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
      const todosMedicos = await prisma.medico.findMany({ 
        where: { ativo: true },
        include: { especialidade: true }
      });
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
          especialidade: { 
            nome: { contains: esp, mode: "insensitive" } 
          },
        },
        include: { especialidade: true }
      });
      if (medicos.length === 0) {
        return { disponivel: false, motivo: "Nenhum médico com essa especialidade." };
      }
      console.log(`[ESPECIALIDADE] Encontrados ${medicos.length} médicos para '${criteria.especialidade}'`);
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

    // 🎯 NOVO: Array para armazenar médicos disponíveis com score
    const medicosDisponiveis = [];

    for (const medico of medicos) {
      console.log(`[CHECK] Médico #${medico.id} (${medico.nome})`);

      // ✅ NOVO: Verificar se o médico tem disponibilidades configuradas
      const totalDisponibilidades = await prisma.disponibilidadeMedico.count({
        where: { medicoId: medico.id, disponivel: true }
      });
      
      if (totalDisponibilidades === 0) {
        console.log(`   ⚠️  Médico sem disponibilidades configuradas`);
        continue;
      }

      // Disponibilidade na grade semanal
      // Extrair apenas a hora da data desejada para comparar com horaInicio/horaFim
      const horaDesejada = new Date(`1970-01-01T${dataHoraDesejada.getUTCHours().toString().padStart(2, '0')}:${dataHoraDesejada.getUTCMinutes().toString().padStart(2, '0')}:00Z`);
      
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

      // ✅ Disponível! Calcular score para ranking
      console.log("   ✅  Horário livre!");
      
      // 🎯 Calcular score baseado em:
      // 1. Proximidade do horário desejado (preferir horários próximos)
      // 2. Quantidade de disponibilidades do médico (mais flexível)
      // 3. Menos consultas agendadas (menos ocupado)
      
      const horaDesejadaMinutos = dataHoraDesejada.getHours() * 60 + dataHoraDesejada.getMinutes();
      const horaInicioMinutos = disponibilidade.horaInicio.getHours() * 60 + disponibilidade.horaInicio.getMinutes();
      const horaFimMinutos = disponibilidade.horaFim.getHours() * 60 + disponibilidade.horaFim.getMinutes();
      
      // Score de proximidade (quanto mais próximo do meio do horário, melhor)
      const meioHorario = (horaInicioMinutos + horaFimMinutos) / 2;
      const distanciaDoMeio = Math.abs(horaDesejadaMinutos - meioHorario);
      const scoreProximidade = Math.max(0, 100 - distanciaDoMeio);
      
      // Score de flexibilidade (mais disponibilidades = mais flexível)
      const scoreFlexibilidade = Math.min(50, totalDisponibilidades * 5);
      
      // Score de ocupação (menos consultas = menos ocupado)
      const consultasAgendadas = await prisma.consulta.count({
        where: { 
          medicoId: medico.id, 
          status: { notIn: ["cancelada"] },
          dataHora: { gte: new Date() }
        }
      });
      const scoreOcupacao = Math.max(0, 50 - consultasAgendadas * 2);
      
      const scoreTotal = scoreProximidade + scoreFlexibilidade + scoreOcupacao;
      
      medicosDisponiveis.push({
        medico,
        disponibilidade,
        score: scoreTotal,
        detalhes: {
          proximidade: scoreProximidade,
          flexibilidade: scoreFlexibilidade,
          ocupacao: scoreOcupacao
        }
      });
      
      console.log(`   📊 Score: ${scoreTotal} (prox: ${scoreProximidade}, flex: ${scoreFlexibilidade}, ocup: ${scoreOcupacao})`);
    }

    // 🏆 Escolher o melhor médico disponível
    if (medicosDisponiveis.length === 0) {
      console.log("   ❌  Nenhum médico disponível no horário solicitado.");
      return { disponivel: false, motivo: "O horário solicitado não está disponível." };
    }

    // Ordenar por score (maior primeiro)
    medicosDisponiveis.sort((a, b) => b.score - a.score);
    const melhorMedico = medicosDisponiveis[0];
    
    console.log(`🏆 Melhor médico escolhido: ${melhorMedico.medico.nome} (score: ${melhorMedico.score})`);
    
    // Se há múltiplos médicos com scores similares, oferecer opções
    const medicosSimilares = medicosDisponiveis.filter(m => 
      Math.abs(m.score - melhorMedico.score) < 20 && m.medico.id !== melhorMedico.medico.id
    );
    
    if (medicosSimilares.length > 0 && criteria.especialidade) {
      const opcoes = [melhorMedico.medico.nome, ...medicosSimilares.map(m => m.medico.nome)];
      return {
        disponivel: false,
        motivo: "Múltiplos médicos disponíveis",
        precisaConfirmar: "medico",
        sugestoes: opcoes.slice(0, 3), // Máximo 3 opções
        detalhes: `Encontrei ${opcoes.length} médicos disponíveis. Qual você prefere?`
      };
    }

    return {
      disponivel: true,
      motivo: `Horário encontrado com ${melhorMedico.medico.nome} (${melhorMedico.medico.especialidade.nome}) em ${dataHoraDesejada.toLocaleString("pt-BR")}.`,
      proximaAcao: {
        funcao: "confirmar_agendamento_consulta",
        argumentos: { 
          medicoId: melhorMedico.medico.id, 
          dataHora: toISOWithTimezone(
            dataHoraDesejada.toISOString().split('T')[0], 
            dataHoraDesejada.toTimeString().slice(0, 5)
          )
        },
      },
    };
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
    console.log(`[TIMEZONE DEBUG] confirmarAgendamento - Local: ${inicio.toLocaleString('pt-BR', { timeZone: TZ })}`);
    
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

// Função de debug para testes
export async function debugAgendamento(criteria) {
  console.log("\n========= DEBUG AGENDAMENTO =========");
  console.log("[INPUT] criteria:", JSON.stringify(criteria));

  try {
    // 1. Verificar médicos da especialidade
    if (criteria.especialidade) {
      const esp = normalizeEspecialidade(criteria.especialidade);
      const medicos = await prisma.medico.findMany({
        where: {
          ativo: true,
          especialidade: { 
            nome: { contains: esp, mode: "insensitive" } 
          },
        },
        include: { 
          especialidade: true,
          disponibilidades: true
        }
      });
      
      console.log(`[DEBUG] Médicos encontrados para '${criteria.especialidade}': ${medicos.length}`);
      medicos.forEach(m => {
        console.log(`   - ${m.nome} (${m.especialidade.nome}) - Disponibilidades: ${m.disponibilidades.length}`);
      });
    }

    // 2. Verificar data/hora
    if (criteria.data && criteria.hora) {
      const dataHoraDesejada = parseDateTimeWithTimezone(criteria.data, criteria.hora);
      const diaSemana = dataHoraDesejada.getDay();
      const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      
      console.log(`[DEBUG] Data/Hora: ${dataHoraDesejada.toLocaleString('pt-BR')}`);
      console.log(`[DEBUG] Dia da semana: ${dias[diaSemana]} (${diaSemana})`);
    }

    // 3. Executar verificação normal
    const resultado = await verificarDisponibilidade(criteria);
    console.log(`[DEBUG] Resultado:`, resultado);
    
    return resultado;
  } catch (err) {
    console.error("[DEBUG] Erro:", err);
    return { error: err.message };
  }
}