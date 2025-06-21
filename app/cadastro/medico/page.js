// app/cadastro/medico/page.js
import prisma from "@/lib/prisma";
import { MedicRegisterForm } from "@/components/forms/RegistroMedico";

// Esta página agora é um Server Component que busca os dados.
export default async function RegisterMedicPage() {
  // Buscamos as especialidades ativas do banco de dados.
  const specialties = await prisma.especialidade.findMany({
    where: {
      ativo: true,
    },
    orderBy: {
      nome: 'asc', // Ordenar por nome para melhor UX
    },
  });

  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
      {/* Passamos as especialidades para o componente de formulário */}
      <MedicRegisterForm specialties={specialties} />
    </div>
  );
}