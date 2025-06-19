// components/layout/Header.jsx
import Link from 'next/link';
import { auth } from '@/auth'; // Importa a função auth para pegar a sessão no servidor
import { logoutAction } from '@/lib/actions';

export default async function LoginLogout() {
  const session = await auth(); // Pega a sessão do usuário

  return (
    <header className="p-4 bg-gray-100">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">Telemed</Link>
        <div>
          {session?.user ? (
            <div className="flex items-center gap-4">
              <span>Olá, {session.user.name} ({session.user.role})</span>
              <form action={logoutAction}>
                <button type="submit">Sair</button>
              </form>
            </div>
          ) : (
            <Link href="/login">Entrar</Link>
          )}
        </div>
      </nav>
    </header>
  );
}