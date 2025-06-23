// Exemplo: app/dashboard/page.js
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { handleLogout } from '@/lib/actions';

export default async function DashboardPage() {
  const session = await auth();

  // O middleware já deve cuidar disso, mas é uma dupla verificação.
  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Olá, {session.user.name}.</p>
      <p>Seu email é: {session.user.email}</p>
      <p>Seu ID de usuário é: {session.user.id}</p>
      <div>
        <form action={handleLogout}>
          <button type="submit">Sair (via Server Action)</button>
        </form>
      </div>
    </div>
  );
}
