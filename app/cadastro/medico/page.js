// app/cadastro/medico/page.js
import prisma from "@/lib/prisma";
import { MedicRegisterForm } from "@/components/forms/RegistrarMedico";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Esta página agora é um Server Component que busca os dados.
export default async function RegisterMedicPage() {
  const session = await auth();
  if (session?.user) {
    redirect('/');
  }

  const specialties = await prisma.especialidade.findMany({
    where: {
      ativo: true,
    },
    orderBy: {
      nome: 'asc', // Ordenar por nome para melhor UX
    },
  });

  return (
    <div className="">
      {/* Passamos as especialidades para o componente de formulário */}
      <MedicRegisterForm specialties={specialties} />
    </div>
  );
}