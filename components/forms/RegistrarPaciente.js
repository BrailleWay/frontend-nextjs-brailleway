// Cadastro gamificado com Poppins e estilo refinado e login social funcional

"use client";

import { useState } from "react";
import { registerPatient } from "@/lib/actions";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function RegistrarPaciente() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const nextStep = () => {
    if (step === 1 && formData.name && formData.birthDate) {
      setStep(2);
    } else if (step === 2 && formData.email) {
      setStep(3);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const progressPercent = (step / 3) * 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    setIsLoading(true);
    try {
      const result = await registerPatient(formData);
      if (result.success) {
        setSuccess("Cadastro realizado com sucesso! Redirecionando...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Erro ao cadastrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen min-w-full flex items-center justify-center p-4 font-[Poppins,sans-serif]"
      style={{
        backgroundImage: "url('/login/CaraLendoBraille.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex items-center justify-center w-full max-w-6xl">
        <div className="relative flex w-full max-w-6xl h-[680px] rounded-[32px] shadow-lg overflow-hidden">
          <div
            className="hidden md:flex w-1/2 h-full border-4 border-white rounded-l-[32px] justify-center items-center"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          ></div>

          <div className="w-full md:w-1/2 bg-white h-full rounded-r-[32px] md:rounded-l-none flex flex-col justify-center px-8 py-10 relative shadow-lg">
            <div className="flex flex-col items-center">
              <img src="/home/brailleway_logo.png" alt="Logo BrailleWay" className="w-40 h-auto mb-4" />
              <h1 className="text-3xl font-medium text-[#343434] text-center mb-1">
                Olá, tudo bem?
              </h1>
              <p className="text-sm font-light text-[#343434] text-center mb-4 max-w-sm">
                Você está no cadastro de usuário. Vamos preencher um formulário rapidinho para saber mais sobre você, ok?
              </p>
              <div className="w-full bg-gray-200 h-2 rounded-full mt-2 mb-6">
                <div className="bg-gradient-to-r from-[#3E97F3] via-[#227CE7] to-[#47E0D0] h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
              </div>

              <form onSubmit={handleSubmit} className="w-full space-y-6 max-w-md">
                {step === 1 && (
                  <>
                    <div>
                      <Label htmlFor="name" className="mt-4  mb-2 text-[#343434] font-medium">Nome completo</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Informe seu nome"
                        className="bg-gray-100 placeholder:font-light placeholder:text-gray-400 mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="birthDate" className="mb-2 text-[#343434] font-medium">Data de nascimento</Label>
                      <Input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-100 placeholder:font-light placeholder:text-gray-400 mt-1"
                      />
                    </div>
                  </>
                )}
                {step === 2 && (
                  <>
                    <div>
                      <Label htmlFor="email" className="text-[#343434] font-medium">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Informe seu email"
                        className="bg-gray-100 placeholder:font-light placeholder:text-gray-400 mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-[#343434] font-medium">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(11) 99999-9999"
                        className="bg-gray-100 placeholder:font-light placeholder:text-gray-400 mt-1"
                      />
                    </div>
                  </>
                )}
                {step === 3 && (
                  <>
                    <div>
                      <Label htmlFor="password" className="text-[#343434] font-medium">Senha</Label>
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        placeholder="Crie uma senha segura"
                        className="bg-gray-100 placeholder:font-light placeholder:text-gray-400 mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" className="text-[#343434] font-medium">Confirmar senha</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        placeholder="Repita a senha"
                        className="bg-gray-100 placeholder:font-light placeholder:text-gray-400 mt-1"
                      />
                    </div>
                  </>
                )}

                {error && (
                  <Alert className="bg-red-100">
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-100">
                    <AlertDescription className="text-green-700">{success}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-center gap-4">
                  {step > 1 && (
                    <Button type="button" onClick={prevStep} className="bg-gray-300 text-[#343434] rounded-full px-6 py-2">Voltar</Button>
                  )}
                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-gradient-to-r from-[#3E97F3] via-[#227CE7] to-[#47E0D0] text-white font-medium rounded-full px-6 py-2"
                      disabled={
                        (step === 1 && (!formData.name || !formData.birthDate)) ||
                        (step === 2 && !formData.email)
                      }
                    >
                      Próxima etapa
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-[#3E97F3] via-[#227CE7] to-[#47E0D0] text-white font-medium rounded-full px-6 py-2">
                      {isLoading ? (
                        <><LoadingSpinner size="sm" className="mr-2" />Cadastrando...</>
                      ) : (
                        "Criar conta"
                      )}
                    </Button>
                  )}
                </div>
              </form>

              <p className="mt-8 text-sm text-gray-500 text-center">
                Já tem uma conta? <Link href="/login" className="text-[#338DEF] underline">Faça login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
