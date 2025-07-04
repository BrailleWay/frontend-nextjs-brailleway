// actions/logar.js  –  JavaScript puro + Auth.js v5
'use server';

import { signIn } from '@/auth';          // export criado em auth.js
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function logar(_prevState, formData) {
  const email    = formData.get('email')    ?? '';
  const password = formData.get('password') ?? '';

  if (!email || !password) return 'Preencha todos os campos.';

  // ─── NÃO envolva redirect() no try ───
  let authOK = false;          // flag de sucesso

  try {
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,         // evita redirect automático do Auth.js
    });

    if (res?.error) {
      return res.error === 'CredentialsSignin'
        ? 'Email ou senha inválidos.'
        : 'Erro ao fazer login.';
    }

    authOK = true;             // login deu certo
  } catch (err) {
    console.error(err);
    return 'Erro inesperado. Tente novamente.';
  }

  /* redireciona fora do try/catch */
  if (authOK) {
    revalidatePath('/');       // opcional
    redirect('/');             // lança NEXT_REDIRECT (agora não é capturado)
  }
}
