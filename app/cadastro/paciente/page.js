// app/cadastro/paciente/page.jsx
import FormularioCadastroPaciente from "@/components/forms/FormularioCadastroPaciente";

export default function PaginaCadastroPaciente() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Cadastro de Paciente</h1>
      <FormularioCadastroPaciente />
    </div>
  );
}