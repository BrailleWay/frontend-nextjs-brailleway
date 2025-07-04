'use server';

import { signIn } from '@/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function logar(_prevState, formData) {
  const email    = formData.get('email')    ?? '';
  const password = formData.get('password') ?? '';

  if (!email || !password) return 'Preencha todos os campos.';

  let authOK = false;

  try {
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      return res.error === 'CredentialsSignin'
        ? 'Email ou senha inválidos.'
        : 'Erro ao fazer login.';
    }

    authOK = true;
  } catch (err) {
    console.error(err);
    return 'Erro inesperado. Tente novamente.';
  }

  if (authOK) {
    revalidatePath('/');
    redirect('/');
  }
}
