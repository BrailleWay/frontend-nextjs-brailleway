// components/forms/FormularioCadastroMedico.jsx
"use client";

import { criarMedico } from "@/lib/actions";
import { Button } from "@/components/ui/button";

// O componente agora recebe as especialidades como prop
export default function FormularioCadastroMedico({ especialidades }) {
  return (
    <form action={criarMedico} className="max-w-lg mx-auto flex flex-col gap-4">
      {/* Campos de nome, email, senha, telefone, crm... (iguais ao de paciente) */}
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo</label>
        <input type="text" name="nome" id="nome" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" name="email" id="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
      </div>

       <div>
        <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha</label>
        <input type="password" name="senha" id="senha" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
      </div>

      <div>
        <label htmlFor="crm" className="block text-sm font-medium text-gray-700">CRM</label>
        <input type="text" name="crm" id="crm" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
      </div>

      <div>
        <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
        <input type="tel" name="telefone" id="telefone" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
      </div>
      
      {/* Campo de Seleção para Especialidade */}
      <div>
        <label htmlFor="especialidadeId" className="block text-sm font-medium text-gray-700">Especialidade</label>
        <select
          name="especialidadeId"
          id="especialidadeId"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm p-2"
        >
          <option value="">Selecione uma especialidade...</option>
          {especialidades.map((esp) => (
            <option key={esp.id} value={esp.id}>
              {esp.nome}
            </option>
          ))}
        </select>
      </div>

      <Button
        type="submit"
        className="text-white text-lg mt-4 bg-[#BE5985] hover:bg-[#BE5985]/80 p-3"
      >
        Cadastrar Médico
      </Button>
    </form>
  );
}