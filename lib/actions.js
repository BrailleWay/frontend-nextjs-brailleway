// file: lib/actions.js
"use server";

import prisma from "./prisma";
import bcrypt from "bcryptjs";
import { signOut, auth } from "@/auth";
import { add } from "date-fns";
import stringSimilarity from "string-similarity";

// --- NORMALIZAÇÃO PARA FUZZY MATCH ---
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

// --- REGISTRO DE PACIENTE E MÉDICO ---
export async function registerPatient(data) {
  const { name, email, password, phone, birthDate, gender } = data;
  if (!name || !email || !password) {
    return { success: false, message: "Nome, email e senha são obrigatórios." };
  }
  try {
    const existingPatient = await prisma.paciente.findUnique({ where: { email } });
    if (existingPatient) {
      return { success: false, message: "O e-mail fornecido já está em uso." };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.paciente.create({
      data: {
        nome: name,
        email: email,
        senha: hashedPassword,
        telefone: phone,
        data_nascimento: new Date(birthDate),
        genero: gender,
      },
    });
    return { success: true, message: "Paciente registrado com sucesso!" };
  } catch (error) {
    console.error("Erro ao registrar paciente:", error);
    return { success: false, message: "Ocorreu um erro no servidor." };
  }
}

export async function registerMedic(data) {
  const { name, email, password, crm, phone, specialtyId } = data;
  if (!name || !email || !password || !crm || !specialtyId) {
    return {
      success: false,
      message: "Todos os campos obrigatórios devem ser preenchidos.",
    };
  }
  const parsedSpecialtyId = parseInt(specialtyId, 10);
  if (isNaN(parsedSpecialtyId)) {
    return {
      success: false,
      message: "Por favor, selecione uma especialidade válida.",
    };
  }
  try {
    const existingMedic = await prisma.medico.findFirst({
      where: { OR: [{ email: email }, { crm: crm }] },
    });
    if (existingMedic) {
      return { success: false, message: "Email ou CRM já em uso." };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.medico.create({
      data: {
        nome: name,
        email: email,
        senha: hashedPassword,
        crm: crm,
        telefone: phone,
        especialidade: { connect: { id: parsedSpecialtyId } },
        perfilAcesso: { connect: { id: 3 } },
      },
    });
    return { success: true, message: "Médico registrado com sucesso!" };
  } catch (error) {
    console.error("Erro detalhado ao registrar médico:", error);
    return {
      success: false,
      message: "Ocorreu um erro inesperado no servidor.",
    };
  }
}

export async function handleLogout() {
  await signOut();
}

// -------------------- AGENDAMENTO ROBUSTO ------------------

export async function verificarDisponibilidade(criteria) {
  console.log("Backend: Verificando disponibilidade com critérios:", criteria);

  try {
    let medicos = [];
    let nomeMedicoConfirmado = null;
    let especialidadeConfirmada = null;
    let sugestao = null;

    // FUZZY MATCH POR NOME DE MÉDICO
    if (criteria.nome_medico) {
      const todosMedicos = await prisma.medico.findMany({ where: { ativo: true } });
      // Debug: mostra médicos encontrados
      console.log("Médicos cadastrados:", todosMedicos.map(m => ({ id: m.id, nome: m.nome })));
      const nomes = todosMedicos.map(m => normalizeNome(m.nome));
      const nomeBusca = normalizeNome(criteria.nome_medico);
      const { bestMatch, bestMatchIndex } = stringSimilarity.findBestMatch(nomeBusca, nomes);

      // Checa se tem um bom match
      if (bestMatch.rating >= 0.7) {
        medicos.push(todosMedicos[bestMatchIndex]);
        nomeMedicoConfirmado = todosMedicos[bestMatchIndex].nome;
      } else if (bestMatch.rating > 0.45) {
        sugestao = todosMedicos[bestMatchIndex]?.nome;
        // Retorna para o assistente confirmar antes de seguir
        return {
          disponivel: false,
          motivo: "Confirmação necessária",
          precisaConfirmar: "medico",
          sugestao,
        };
      } else {
        return { disponivel: false, motivo: "Nenhum médico encontrado com esse nome." };
      }
    }
    // FUZZY MATCH POR ESPECIALIDADE
    else if (criteria.especialidade) {
      const especialidades = await prisma.especialidade.findMany({ where: { ativo: true } });
      const nomesEspec = especialidades.map(e => normalizeEspecialidade(e.nome));
      const especBusca = normalizeEspecialidade(criteria.especialidade);
      const { bestMatch, bestMatchIndex } = stringSimilarity.findBestMatch(especBusca, nomesEspec);

      if (bestMatch.rating >= 0.7) {
        especialidadeConfirmada = especialidades[bestMatchIndex].nome;
        medicos = await prisma.medico.findMany({
          where: { especialidadeId: especialidades[bestMatchIndex].id, ativo: true }
        });
      } else if (bestMatch.rating > 0.45) {
        sugestao = especialidades[bestMatchIndex]?.nome;
        return {
          disponivel: false,
          motivo: "Confirmação necessária",
          precisaConfirmar: "especialidade",
          sugestao,
        };
      } else {
        return { disponivel: false, motivo: "Nenhuma especialidade encontrada." };
      }
    }

    if (medicos.length === 0)
      return { disponivel: false, motivo: "Nenhum médico encontrado." };

    // CHECAGEM DE HORÁRIO
    const dataHoraDesejada = new Date(`${criteria.data}T${criteria.hora}:00.000-03:00`);
    if (isNaN(dataHoraDesejada.getTime()))
      return { disponivel: false, motivo: "Formato de data ou hora inválido." };

    for (const medico of medicos) {
      // Checa disponibilidade cadastrada
      const disponibilidade = await prisma.disponibilidadeMedico.findFirst({
        where: {
          medicoId: medico.id,
          diaSemana: dataHoraDesejada.getDay(),
          horaInicio: { lte: dataHoraDesejada },
          horaFim: { gt: dataHoraDesejada },
        },
      });
      if (!disponibilidade) continue;

      // Checa bloqueios do médico
      const bloqueio = await prisma.bloqueioAgenda.findFirst({
        where: {
          medicoId: medico.id,
          data_inicio: { lte: dataHoraDesejada },
          data_fim: { gte: dataHoraDesejada },
        },
      });
      if (bloqueio) continue;

      // Checa conflitos de agendamento
      const duracaoConsulta = 30;
      const dataHoraFimDesejada = add(dataHoraDesejada, { minutes: duracaoConsulta });

      const consultaConflitante = await prisma.consulta.findFirst({
        where: {
          medicoId: medico.id,
          status: { notIn: ["cancelada"] },
          OR: [
            {
              dataHora: { lt: dataHoraFimDesejada },
              data_hora_fim: { gt: dataHoraDesejada },
            },
          ],
        },
      });

      if (!consultaConflitante) {
        // Envia o ID correto do médico encontrado!
        return {
          disponivel: true,
          medicoId: medico.id,
          nomeMedico: medico.nome,
          dataHora: dataHoraDesejada.toISOString(),
          nomeMedicoConfirmado,
          especialidadeConfirmada,
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
  // Garante que o usuário está autenticado como paciente
  const session = await auth();
  if (!session || session.user.role !== "paciente") {
    return {
      success: false,
      message: "Apenas pacientes logados podem agendar.",
    };
  }
  let { medicoId, dataHora } = details;
  medicoId = parseInt(medicoId, 10);

  // Garante que o médico existe
  const medicoExists = await prisma.medico.findUnique({ where: { id: medicoId } });
  if (!medicoExists) {
    return { success: false, message: "Médico não encontrado no sistema." };
  }

  try {
    await prisma.consulta.create({
      data: {
        pacienteId: parseInt(session.user.id),
        medicoId: medicoId,
        dataHora: new Date(dataHora),
        data_hora_fim: add(new Date(dataHora), { minutes: 30 }),
        status: "agendada",
        duracaoMinutos: 30,
      },
    });
    return { success: true, message: "Consulta agendada com sucesso!" };
  } catch (error) {
    console.error("ERRO AO CONFIRMAR AGENDAMENTO:", error);
    return { success: false, message: `Erro do servidor: ${error.message}` };
  }
}
