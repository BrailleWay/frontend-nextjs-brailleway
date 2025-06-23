// app/cadastro/paciente/page.js
"use client";

import { useState } from "react";
import { registerPatient } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PasswordStrength } from "@/components/ui/password-strength";
import { useRedirectIfAuthenticated } from "@/hooks/use-auth";
import { Eye, EyeOff, User, Mail, Phone, Calendar, Lock } from "lucide-react";
import Link from "next/link";

export default function RegisterPatientPage() {
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Redireciona se já estiver autenticado
  const { isAuthenticated } = useRedirectIfAuthenticated();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erros quando o usuário começar a digitar
    if (error) setError("");
  };

  const validateForm = () => {
    // Nome
    if (!formData.name.trim()) {
      setError("Nome completo é obrigatório");
      return false;
    }
    
    if (formData.name.trim().length < 3) {
      setError("Nome deve ter pelo menos 3 caracteres");
      return false;
    }

    // Email
    if (!formData.email.trim()) {
      setError("Email é obrigatório");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Digite um email válido");
      return false;
    }

    // Telefone (opcional, mas se preenchido deve ser válido)
    if (formData.phone.trim()) {
      const phoneRegex = /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/;
      if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
        setError("Digite um telefone válido");
        return false;
      }
    }

    // Data de nascimento
    if (!formData.birthDate) {
      setError("Data de nascimento é obrigatória");
      return false;
    }

    const birthDate = new Date(formData.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age < 0 || age > 120) {
      setError("Data de nascimento inválida");
      return false;
    }

    if (age < 13) {
      setError("Você deve ter pelo menos 13 anos para se cadastrar");
      return false;
    }

    // Gênero
    if (!formData.gender) {
      setError("Selecione um gênero");
      return false;
    }

    // Senha
    if (!formData.password) {
      setError("Senha é obrigatória");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres");
      return false;
    }

    // Confirmação de senha
    if (!formData.confirmPassword) {
      setError("Confirme sua senha");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await registerPatient(formData);

      if (result.success) {
        setSuccess("Cadastro realizado com sucesso! Redirecionando para login...");
        // Limpar formulário
        setFormData({
          name: "",
          email: "",
          phone: "",
          birthDate: "",
          gender: "",
          password: "",
          confirmPassword: "",
        });
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Erro durante cadastro:", error);
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Se já está autenticado, mostra loading
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" className="mb-4" />
          <p className="text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BrailleWay</h1>
          <p className="text-gray-600">Crie sua conta de paciente</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome Completo */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4" />
                Nome Completo
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Digite seu nome completo"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="seu@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefone (Opcional)
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(11) 99999-9999"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
                autoComplete="tel"
              />
            </div>

            {/* Data de Nascimento e Gênero */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Data de Nascimento
                </Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                  Gênero
                </Label>
                <select
                  name="gender"
                  id="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  disabled={isLoading}
                >
                  <option value="">Selecione...</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="Outro">Outro</option>
                  <option value="Prefiro_nao_informar">Prefiro não informar</option>
                </select>
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Digite sua senha"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              <PasswordStrength password={formData.password} />
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Confirmar Senha
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirme sua senha"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="flex items-center gap-2">
                  {formData.password === formData.confirmPassword ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs">Senhas coincidem</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-xs">Senhas não coincidem</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Success Message */}
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Cadastrando...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Faça login aqui
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            © 2024 BrailleWay. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}