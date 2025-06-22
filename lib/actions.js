// lib/actions.js
"use server";

import prisma from "./prisma"; //
import bcrypt from "bcryptjs";
import { signOut } from "@/auth";
import { auth } from "@/auth";
import { add } from "date-fns";
/**
 * Registra um novo paciente no banco de dados.
 * @param {object} data - Os dados do paciente.
 * @param {string} data.name - O nome do paciente.
 * @param {string} data.email - O email do paciente.
 * @param {string} data.password - A senha do paciente.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function registerPatient(data) {
  const { name, email, password, phone, birthDate, gender } = data;

  if (!name || !email || !password) {
    return { success: false, message: "Nome, email e senha são obrigatórios." };
  }

  try {
    const existingPatient = await prisma.paciente.findUnique({
      where: { email },
    });

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
        dataNascimento  : new Date(birthDate),
        genero: gender,
      },
    });

    return { success: true, message: "Paciente registrado com sucesso!" };
  } catch (error) {
    console.error("Erro ao registrar paciente:", error);
    return { success: false, message: "Ocorreu um erro no servidor." };
  }
}

/**
 * Registra um novo médico no banco de dados.
 * @param {object} data - Os dados do médico.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function registerMedic(data) {
  const { name, email, password, crm, phone, specialtyId } = data;

  if (!name || !email || !password || !crm || !specialtyId) {
    return {
      success: false,
      message: "Todos os campos obrigatórios devem ser preenchidos.",
    };
  }

  // Validação para garantir que specialtyId é um número válido
  const parsedSpecialtyId = parseInt(specialtyId, 10);
  if (isNaN(parsedSpecialtyId)) {
    return { success: false, message: "Por favor, selecione uma especialidade válida." };
  }

  try {
    const existingMedic = await prisma.medico.findFirst({
      where: {
        OR: [{ email: email }, { crm: crm }],
      },
    });

    if (existingMedic) {
      if (existingMedic.email === email) {
        return {
          success: false,
          message: "O e-mail fornecido já está em uso.",
        };
      }
      if (existingMedic.crm === crm) {
        return { success: false, message: "O CRM fornecido já está em uso." };
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.medico.create({
      data: {
        nome: name,
        email: email,
        senha: hashedPassword,
        crm: crm,
        telefone: phone,
        
        // CORREÇÃO FINAL APLICADA PARA AMBAS AS RELAÇÕES
        especialidade: {
          connect: {
            // O ID no modelo Especialidade também é 'id'
            id: parsedSpecialtyId,
          },
        },
        perfilAcesso: {
          connect: {
            // O ID no modelo PerfilAcesso é 'id'
            id: 3, // ID 3 para o perfil de Médico
          },
        },
      },
    });

    return { success: true, message: "Médico registrado com sucesso!" };
  } catch (error) {
    console.error("Erro detalhado ao registrar médico:", error);
    return { success: false, message: "Ocorreu um erro inesperado no servidor." };
  }
}

export async function handleLogout() {
  await signOut();
}




// --------------------------------------

export async function verificarDisponibilidade(criteria) {
  console.log("\n--- INICIANDO VERIFICAÇÃO DE DISPONIBILIDADE ---");
  console.log("Critérios recebidos da IA:", criteria);

  if (!criteria || !criteria.data || !criteria.hora) {
      console.error("ERRO: Critérios de data ou hora faltando.");
      return { disponivel: false, motivo: "Por favor, especifique a data e a hora." };
  }

  try {
    let medicos = [];
    if (criteria.nome_medico) {
      console.log(`Buscando médico pelo nome: ${criteria.nome_medico}`);
      const medico = await prisma.medico.findFirst({
        where: { nome: { contains: criteria.nome_medico, mode: 'insensitive' }, ativo: true },
        include: { especialidade: true },
      });
      if (medico) {
        console.log("Médico encontrado:", medico.nome, `(ID: ${medico.id})`);
        medicos.push(medico);
      }
    } else if (criteria.especialidade) {
      console.log(`Buscando médicos pela especialidade: ${criteria.especialidade}`);
      medicos = await prisma.medico.findMany({
        where: { especialidade: { nome: { contains: criteria.especialidade, mode: 'insensitive' } }, ativo: true },
        include: { especialidade: true },
      });
       console.log(`${medicos.length} médico(s) encontrado(s) para a especialidade.`);
    }

    if (medicos.length === 0) {
      console.log("Nenhum médico encontrado.");
      return { disponivel: false, motivo: "Nenhum médico encontrado com esse nome ou especialidade." };
    }

    const dataHoraDesejada = new Date(`${criteria.data}T${criteria.hora}:00.000-03:00`);
    if (isNaN(dataHoraDesejada.getTime())) {
        console.error("ERRO: Formato de data/hora inválido recebido:", criteria.data, criteria.hora);
        return { disponivel: false, motivo: "O formato de data ou hora parece inválido." };
    }
    console.log(`Data e hora desejada (objeto Date): ${dataHoraDesejada.toISOString()}`);

    for (const medico of medicos) {
      console.log(`\nVerificando agenda do Dr(a). ${medico.nome}...`);
      
      const diaDaSemana = dataHoraDesejada.getDay();
      const horaDesejada = `${criteria.hora}:00`;

      const disponibilidade = await prisma.disponibilidadeMedico.findFirst({
        where: { medico_id: medico.id, dia_semana: diaDaSemana, hora_inicio: { lte: horaDesejada }, hora_fim: { gt: horaDesejada } },
      });
      if (!disponibilidade) {
        console.log(`- Dr(a). ${medico.nome} não trabalha neste dia/horário.`);
        continue;
      }
      console.log("- Está dentro do horário de trabalho.");

      const bloqueio = await prisma.bloqueioAgenda.findFirst({
        where: { medico_id: medico.id, data_inicio: { lte: dataHoraDesejada }, data_fim: { gte: dataHoraDesejada } },
      });
      if (bloqueio) {
        console.log(`- Encontrado um bloqueio na agenda.`);
        continue;
      }
      console.log("- Sem bloqueios na agenda.");

      const duracaoConsulta = 30;
      const dataHoraFimDesejada = add(dataHoraDesejada, { minutes: duracaoConsulta });

      console.log("Verificando conflitos de consulta...");
      const consultaConflitante = await prisma.consulta.findFirst({
        where: {
          medico_id: medico.id,
          status: { notIn: ['cancelada'] },
          OR: [{ data_hora: { lt: dataHoraFimDesejada }, data_hora_fim: { gt: dataHoraDesejada } }],
        },
      });
      
      if (consultaConflitante) {
         console.log(`- Encontrado conflito com a consulta ID: ${consultaConflitante.id}`);
         continue;
      }
      
      console.log("HORÁRIO DISPONÍVEL ENCONTRADO!");
      return {
        disponivel: true,
        medicoId: medico.id,
        nomeMedico: medico.nome,
        dataHora: dataHoraDesejada.toISOString(),
      };
    }

    console.log("Nenhum médico com horário disponível encontrado após todas as verificações.");
    return { disponivel: false, motivo: "O horário solicitado não está disponível para nenhum médico. Por favor, tente outra data ou hora." };

  } catch (error) {
    console.error("--- ERRO CRÍTICO NA FUNÇÃO verificarDisponibilidade ---");
    console.error(error); // Log completo do erro
    return { disponivel: false, motivo: "Ocorreu um erro interno grave ao tentar verificar a disponibilidade." };
  }
}

// FUNÇÃO 2: CONFIRMAR O AGENDAMENTO
export async function confirmarAgendamento(details) {
  const session = await auth();

  if (!session || session.user.role !== 'paciente') {
    return { success: false, message: "Apenas pacientes logados podem agendar consultas." };
  }

  const { medicoId, dataHora } = details;
  const pacienteId = parseInt(session.user.id);

  try {
    // (Opcional, mas recomendado) Re-verificar disponibilidade antes de criar para evitar race conditions
    // ...

    await prisma.consulta.create({
      data: {
        paciente_id: pacienteId,
        medico_id: medicoId,
        data_hora: new Date(dataHora),
        data_hora_fim: add(new Date(dataHora), { minutes: 30 }), // Adicionando data de fim
        status: 'agendada',
        duracao_minutos: 30,
      },
    });

    return { success: true, message: "Consulta agendada com sucesso!" };
  } catch (error) {
    console.error("Erro ao confirmar agendamento:", error);
    return { success: false, message: "Não foi possível confirmar o agendamento." };
  }
}