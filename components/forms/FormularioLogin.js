// components/forms/FormularioLogin.jsx
"use client";

import { loginAction } from "@/lib/actions"; // Nossa nova Server Action

export default function FormularioLogin() {
  return (
    <form action={loginAction} className="max-w-sm mx-auto flex flex-col gap-4">
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
      </div>
      <div>
        <label htmlFor="senha">Senha</label>
        <input type="password" name="senha" id="senha" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
      </div>
      <button type="submit" className="text-white text-lg mt-4 bg-[#BE5985] hover:bg-[#BE5985]/80 p-3">
        Entrar
      </button>
    </form>
  );
}