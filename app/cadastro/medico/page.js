// app/cadastro/medico/page.jsx
import prisma from "@/lib/prisma";
import FormularioCadastroMedico from "@/components/forms/FormularioCadastroMedico";


async function getEspecialidades() {
  const especialidades = await prisma.especialidade.findMany({
    where: { ativo: true },
    orderBy: { nome: 'asc' }
  });
  return especialidades;
}

export default async function PaginaCadastroMedico() {
  const especialidades = await getEspecialidades();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Cadastro de Médico</h1>
      <FormularioCadastroMedico especialidades={especialidades} />
    </div>
  );
}