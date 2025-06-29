import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RegistrarPaciente from "@/components/forms/RegistrarPaciente";

export default async function RegistrarPacientePage() {
  const session = await auth();
  if (session?.user) {
    redirect('/');
  }

  // 3. Se não, renderiza o componente de formulário
  return <RegistrarPaciente />;
}