// lib/actions.js
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

/**
 * Cria um novo Paciente no banco de dados.
 */
export async function criarPaciente(formData) {
  const nome = formData.get("nome");
  const email = formData.get("email");
  const senha = formData.get("senha");
  const telefone = formData.get("telefone");
  const dataNascimento = new Date(formData.get("dataNascimento"));
  const genero = formData.get("genero"); // "M", "F", "Outro", etc.

  // Validação básica (em um projeto real, use Zod ou outra biblioteca)
  if (!nome || !email || !senha || !dataNascimento || !genero) {
    throw new Error("Todos os campos obrigatórios devem ser preenchidos.");
  }

  // Criptografar a senha
  const senhaHash = await bcrypt.hash(senha, 10);

  try {
    await prisma.paciente.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        telefone,
        dataNascimento,
        genero,
      },
    });
  } catch (error) {
    // Tratar erro de email duplicado, por exemplo
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        console.error("Erro: Já existe um usuário com este e-mail.");
        // Aqui você pode retornar uma mensagem de erro para o formulário
        return { error: "Já existe um usuário com este e-mail." };
    }
    console.error(error);
    return { error: "Não foi possível criar o usuário." };
  }

  revalidatePath("/pacientes"); // Opcional: se você tiver uma lista de pacientes
  redirect("/homepage"); // Redireciona para a página de login após o sucesso
}


/**
 * Cria um novo Médico no banco de dados.
 */
export async function criarMedico(formData) {
  // OBS: Seu schema de Medico não tem senha. Adicionei um campo de senha
  // por padrão, pois é uma prática comum para login.
  // Se o médico não tiver login, pode remover essa parte.

  const nome = formData.get("nome");
  const email = formData.get("email");
  const senha = formData.get("senha"); // Assumindo que médicos também fazem login
  const crm = formData.get("crm");
  const telefone = formData.get("telefone");
  const especialidadeId = parseInt(formData.get("especialidadeId"), 10);

  if (!nome || !email || !senha || !crm || !especialidadeId) {
    throw new Error("Todos os campos obrigatórios devem ser preenchidos.");
  }
  
  const senhaHash = await bcrypt.hash(senha, 10);

  try {
    await prisma.medico.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        crm,
        telefone,
        especialidadeId,
      },
    });
  } catch (error) {
    if (error.code === 'P2002') {
        console.error("Erro: Email ou CRM já cadastrado.");
        return { error: "Email ou CRM já cadastrado." };
    }
    console.error(error);
    return { error: "Não foi possível criar o cadastro do médico." };
  }

  revalidatePath("/medicos");
  redirect("/homepage");
}