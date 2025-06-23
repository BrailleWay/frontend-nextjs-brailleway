// lib/actions.js
"use server";

import prisma from "./prisma"; //
import bcrypt from "bcryptjs";
import { signOut } from "@/auth";
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