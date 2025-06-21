// app/cadastro/medico/_components/MedicRegisterForm.js
"use client";

import { useState } from "react";
import { registerMedic } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function MedicRegisterForm({ specialties = [] }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    if (data.password !== data.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    const result = await registerMedic(data);

    if (result.success) {
      setSuccess(result.message);
      event.target.reset(); // Limpa o formulário
    } else {
      setError(result.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg p-8 space-y-6 bg-white shadow-md rounded-lg"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">Cadastro de Médico</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo</Label>
          <Input name="name" id="name" type="text" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="crm">CRM</Label>
          <Input name="crm" id="crm" type="text" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input name="email" id="email" type="email" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input name="phone" id="phone" type="tel" placeholder="(XX) XXXXX-XXXX" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="specialtyId">Especialidade</Label>
          <select
            name="specialtyId"
            id="specialtyId"
            required
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Selecione...</option>
            {/* Mapeia as especialidades recebidas via props */}
            {specialties.map((spec) => (
              <option key={spec.id} value={spec.id}>
                {spec.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input name="password" id="password" type="password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
        <Input
          name="confirmPassword"
          id="confirmPassword"
          type="password"
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Cadastrar
      </Button>
      <p className="text-center text-sm">
        Já tem uma conta?{" "}
        <Link href="/login" className="font-semibold text-blue-600 hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}