import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RegistrarPaciente from "@/components/forms/RegistrarPaciente";

export default async function RegistrarPacientePage() {
  // 1. Busca a sessão no servidor
  const session = await auth();

  // 2. Se o usuário já está logado, redireciona para a homepage
  if (session?.user) {
    redirect('/homepage');
  }

  // 3. Se não, renderiza o componente de formulário
  return <RegistrarPaciente />;
}