// file: components/LoginForm.js

"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/lib/actions";
import { useState } from "react"; // O único useState que ainda precisamos

// Componente separado para o botão de submit
function LoginButton() {
  const { pending } = useFormStatus(); // Hook para saber o status do form

  return (
    <Button
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white ..."
      disabled={pending} // Desativa o botão automaticamente durante o envio
    >
      {pending ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          Entrando...
        </>
      ) : (
        "Entrar"
      )}
    </Button>
  );
}

export default function LoginForm() {
  // useFormState gerencia o erro que vem da nossa action 'login'
  const [errorMessage, dispatch] = useFormState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BrailleWay</h1>
          <p className="text-gray-600">Faça login para acessar sua conta</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* O 'action' agora usa o 'dispatch' do useFormState */}
          <form action={dispatch} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email" // O 'name' é crucial para o formData
                type="email"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password" // O 'name' é crucial
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center ..."
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* O 'errorMessage' vem diretamente do useFormState */}
            {errorMessage && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            {/* Nosso novo botão com estado de loading automático */}
            <LoginButton />
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{" "}
              <a href="/cadastro/paciente" className="text-blue-600 ...">
                Cadastre-se aqui
              </a>
            </p>
          </div>
        </div>
        
        <div className="text-center mt-8">
            <p className="text-xs text-gray-500">
                © 2025 BrailleWay. Todos os direitos reservados.
            </p>
        </div>
      </div>
    </div>
  );
}