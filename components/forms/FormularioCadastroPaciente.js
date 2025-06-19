// components/forms/FormularioCadastroPaciente.jsx
"use client";

import { criarPaciente } from "@/lib/actions";
import { Button } from "@/components/ui/button"; // Supondo que você use ShadCN/UI

export default function FormularioCadastroPaciente() {
  // Você pode adicionar estados aqui para validação em tempo real se desejar

  return (
    <form action={criarPaciente} className="max-w-lg mx-auto flex flex-col gap-4">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo</label>
        <input
          type="text"
          name="nome"
          id="nome"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm p-2"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm p-2"
        />
      </div>
      
      <div>
        <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha</label>
        <input
          type="password"
          name="senha"
          id="senha"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm p-2"
        />
      </div>

      <div>
        <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
        <input
          type="tel"
          name="telefone"
          id="telefone"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm p-2"
        />
      </div>

      <div>
        <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
        <input
          type="date"
          name="dataNascimento"
          id="dataNascimento"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm p-2"
        />
      </div>

      <div>
        <label htmlFor="genero" className="block text-sm font-medium text-gray-700">Gênero</label>
        <select
          name="genero"
          id="genero"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm p-2"
        >
          <option value="">Selecione...</option>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
          <option value="Outro">Outro</option>
          <option value="Prefiro_nao_informar">Prefiro não informar</option>
        </select>
      </div>

      <Button
        type="submit"
        className="text-white text-lg mt-4 bg-[#BE5985] hover:bg-[#BE5985]/80 p-3"
      >
        Cadastrar
      </Button>
    </form>
  );
}