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

export async function handleLogout() {
  await signOut();
}