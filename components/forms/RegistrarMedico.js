// app/cadastro/medico/_components/MedicRegisterForm.js
"use client";

import { PasswordStrength } from "@/components/ui/password-strength";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { registerMedic } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function MedicRegisterForm({ specialties = [] }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [disponibilidades, setDisponibilidades] = useState({
    0: { ativa: false, horaInicio: "08:00", horaFim: "18:00" }, // Domingo
    1: { ativa: false, horaInicio: "08:00", horaFim: "18:00" }, // Segunda
    2: { ativa: false, horaInicio: "08:00", horaFim: "18:00" }, // Terça
    3: { ativa: false, horaInicio: "08:00", horaFim: "18:00" }, // Quarta
    4: { ativa: false, horaInicio: "08:00", horaFim: "18:00" }, // Quinta
    5: { ativa: false, horaInicio: "08:00", horaFim: "18:00" }, // Sexta
    6: { ativa: false, horaInicio: "08:00", horaFim: "18:00" }, // Sábado
  });

  const diasSemana = [
    { id: 0, nome: "Domingo" },
    { id: 1, nome: "Segunda-feira" },
    { id: 2, nome: "Terça-feira" },
    { id: 3, nome: "Quarta-feira" },
    { id: 4, nome: "Quinta-feira" },
    { id: 5, nome: "Sexta-feira" },
    { id: 6, nome: "Sábado" },
  ];

  const handleDisponibilidadeChange = (diaId, field, value) => {
    setDisponibilidades((prev) => ({
      ...prev,
      [diaId]: {
        ...prev[diaId],
        [field]: value,
      },
    }));
  };

  const validateForm = (data) => {
    // Validar se pelo menos um dia está selecionado
    const diasAtivos = Object.values(disponibilidades).filter((d) => d.ativa);
    if (diasAtivos.length === 0) {
      return "Selecione pelo menos um dia da semana para atendimento.";
    }

    // Validar horários
    for (const disponibilidade of diasAtivos) {
      const inicio = new Date(`1970-01-01T${disponibilidade.horaInicio}:00`);
      const fim = new Date(`1970-01-01T${disponibilidade.horaFim}:00`);

      if (inicio >= fim) {
        return "O horário de fim deve ser posterior ao horário de início.";
      }
    }

    // Validar CRM (deve ter pelo menos 5 caracteres)
    if (data.crm.length < 5) {
      return "CRM deve ter pelo menos 5 caracteres.";
    }

    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData.entries());

      if (data.password !== data.confirmPassword) {
        setError("As senhas não coincidem.");
        return;
      }

      // Validação adicional
      const validationError = validateForm(data);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Adicionar disponibilidades ao data
      data.disponibilidades = JSON.stringify(
        Object.entries(disponibilidades).map(([diaSemana, disp]) => ({
          ...disp,
          diaSemana: Number(diaSemana),
        }))
      );

      const result = await registerMedic(data);

      if (result.success) {
        setSuccess(result.message);
        event.target.reset(); // Limpa o formulário
        // Reset disponibilidades
        setDisponibilidades({
          0: { ativa: false, horaInicio: "08:00", horaFim: "18:00" },
          1: { ativa: false, horaInicio: "08:00", horaFim: "18:00" },
          2: { ativa: false, horaInicio: "08:00", horaFim: "18:00" },
          3: { ativa: false, horaInicio: "08:00", horaFim: "18:00" },
          4: { ativa: false, horaInicio: "08:00", horaFim: "18:00" },
          5: { ativa: false, horaInicio: "08:00", horaFim: "18:00" },
          6: { ativa: false, horaInicio: "08:00", horaFim: "18:00" },
        });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Erro inesperado. Tente novamente.");
      console.error("Erro no cadastro:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhone = (value) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, "");

    // Aplica a máscara (XX) XXXXX-XXXX
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7,
        11
      )}`;
    }
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    e.target.value = formatted;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl p-8 space-y-6 bg-white shadow-md rounded-lg"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">
        Cadastro de Médico
      </h1>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}

      {/* Informações Pessoais */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold border-b pb-2">
          Informações Pessoais
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input name="name" id="name" type="text" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="crm">CRM *</Label>
            <Input
              name="crm"
              id="crm"
              type="text"
              required
              placeholder="Ex: 12345-SP"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input name="email" id="email" type="email" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              name="phone"
              id="phone"
              type="tel"
              placeholder="(XX) XXXXX-XXXX"
              onChange={handlePhoneChange}
              maxLength={15}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialtyId">Especialidade *</Label>
            <select
              name="specialtyId"
              id="specialtyId"
              required
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selecione uma especialidade...</option>
              {specialties.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Senha *
            </Label>
            <div className="relative">
              <Input
                name="password"
                id="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                onChange={(e) => setPasswordValue(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <PasswordStrength password={passwordValue} />{" "}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="flex items-center gap-2"
            >
              <Lock className="h-4 w-4" />
              Confirmar Senha *
            </Label>
            <div className="relative">
              <Input
                name="confirmPassword"
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Configuração de Disponibilidade */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold border-b pb-2">
          Horários de Atendimento *
        </h2>
        <p className="text-sm text-gray-600">
          Configure os horários em que você estará disponível para atendimento.
          Marque os dias da semana e defina os horários de início e fim.
        </p>

        <div className="space-y-4">
          {diasSemana.map((dia) => (
            <div
              key={dia.id}
              className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`dia-${dia.id}`}
                  checked={disponibilidades[dia.id].ativa}
                  onChange={(e) =>
                    handleDisponibilidadeChange(
                      dia.id,
                      "ativa",
                      e.target.checked
                    )
                  }
                  className="rounded border-gray-300"
                />
                <Label
                  htmlFor={`dia-${dia.id}`}
                  className="min-w-[120px] font-medium"
                >
                  {dia.nome}
                </Label>
              </div>

              {disponibilidades[dia.id].ativa && (
                <div className="flex items-center space-x-2">
                  <div className="space-y-1">
                    <Label htmlFor={`inicio-${dia.id}`} className="text-xs">
                      Início
                    </Label>
                    <Input
                      type="time"
                      id={`inicio-${dia.id}`}
                      value={disponibilidades[dia.id].horaInicio}
                      onChange={(e) =>
                        handleDisponibilidadeChange(
                          dia.id,
                          "horaInicio",
                          e.target.value
                        )
                      }
                      className="w-32"
                    />
                  </div>
                  <span className="text-gray-500">até</span>
                  <div className="space-y-1">
                    <Label htmlFor={`fim-${dia.id}`} className="text-xs">
                      Fim
                    </Label>
                    <Input
                      type="time"
                      id={`fim-${dia.id}`}
                      value={disponibilidades[dia.id].horaFim}
                      onChange={(e) =>
                        handleDisponibilidadeChange(
                          dia.id,
                          "horaFim",
                          e.target.value
                        )
                      }
                      className="w-32"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Cadastrando..." : "Cadastrar"}
      </Button>

      <p className="text-center text-sm">
        Já tem uma conta?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-600 hover:underline"
        >
          Entrar
        </Link>
      </p>
    </form>
  );
}
