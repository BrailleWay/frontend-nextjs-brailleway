'use server';

import prisma from '../prisma';
import { hash } from 'bcryptjs';               // npm i bcryptjs
import { signIn } from '@/auth';               // exportado em src/auth.js
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// 🔐  Validação robusta no servidor
const PatientSchema = z.object({
  name:      z.string().min(3, 'Nome muito curto'),
  email:     z.string().email('Email inválido'),
  phone:     z.string().optional(),
  birthDate: z.coerce.date(),
  gender:    z.enum(['M', 'F', 'O']).optional(),
  password:  z.string().min(6, 'Senha deve ter 6+ caracteres'),
});

export async function registrarPaciente(_prev, data) {
  // 1) valida
  const parsed = PatientSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }
  const { password, email, ...rest } = parsed.data;

  try {
    // 2) garante unicidade
    await prisma.paciente.create({
      data: {
        ...rest,
        email,
        senha: await hash(password, 12),        // 12 salt rounds
      },
    });
  } catch (err) {
    /* P2002 = unique-constraint — evita SELECT extra  */
    if (err.code === 'P2002') {                // Prisma docs :contentReference[oaicite:0]{index=0}
      return { success: false, message: 'Email já cadastrado.' };
    }
    console.error(err);
    return { success: false, message: 'Erro interno. Tente novamente.' };
  }

  // 3) login automático (Credentials) → não use next-auth/react aqui!
  const res = await signIn('credentials', {
    email,
    password,          // texto puro OK: signIn vai validar contra hash
    redirect: false,   // evitamos redirecionamento implícito :contentReference[oaicite:1]{index=1}
  });

  if (res?.error) {
    /* deveria ser raro: usuário acabou de ser criado */
    return { success: false, message: 'Falha no login automático.' };
  }

  // 4) refresh de cache + redirect fora do try/catch para não capturar NEXT_REDIRECT
  revalidatePath('/');
  redirect('/');       // lança exceção NEXT_REDIRECT — não capture! :contentReference[oaicite:2]{index=2}
}
