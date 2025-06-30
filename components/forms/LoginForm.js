'use client';

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/lib/actions";
import { useState } from "react";

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="
        w-48
        h-12
        rounded-full
        shadow-[0px_4px_4px_#00000040]
        bg-gradient-to-r from-[#3E97F3] via-[#227CE7] to-[#47E0D0]
        font-semibold text-white text-lg
        flex items-center justify-center
        transition duration-200 hover:brightness-110
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      "
      disabled={pending}
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
  const [errorMessage, dispatch] = useFormState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="min-h-screen min-w-full flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/login/CaraLendoBraille.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex items-center justify-center w-full max-w-5xl">
        <div className="relative flex w-full max-w-5xl h-[730px] rounded-[32px] shadow-lg overflow-hidden">
          {/* Lado esquerdo */}
          <div
            className="hidden md:block w-1/2 h-full border-4 border-white rounded-l-[32px]"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
          ></div>

          {/* Lado direito */}
          <div className="w-full md:w-1/2 h-full bg-white rounded-r-[32px] md:rounded-l-none rounded-[32px] relative shadow-lg flex flex-col items-center justify-center">
            
            <div className="mb-4 flex flex-col items-center">
              <img
                src="brailleway_logo.png"
                alt="Logo BrailleWay"
                className="w-50 h-auto mb-4"
              />
              <h1
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontSize: 28,
                  color: "#343434",
                  textAlign: "center",
                  letterSpacing: "-0.96px",
                  marginBottom: "12px",
                }}
              >
                Faça login para acessar sua conta
              </h1>
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 300,
                  fontSize: 14,
                  color: "#343434",
                  textAlign: "center",
                  letterSpacing: "-0.42px",
                  marginBottom: "24px",
                }}
              >
                Informe seu email e senha para continuar no BrailleWay.
              </p>
            </div>

            <form
              action={dispatch}
              className="w-full flex flex-col gap-8 items-center"
              style={{
                fontFamily: "Poppins, sans-serif",
                maxWidth: 400,
              }}
            >
              <div className="w-full">
                <Label
                  htmlFor="email"
                  className="block font-medium mb-2 text-base"
                  style={{ color: "#343434" }}
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Informe seu email"
                  required
                  style={{
                    width: "100%",
                    height: "56px",
                    backgroundColor: "#F4F4F4",
                    borderRadius: "10px",
                    padding: "0 16px",
                    color: "#343434",
                  }}
                />
              </div>

              <div className="w-full">
                <Label
                  htmlFor="password"
                  className="block font-medium mb-2 text-base"
                  style={{ color: "#343434" }}
                >
                  Senha
                </Label>
                <div className="relative" style={{ height: "56px" }}>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    required
                    style={{
                      width: "100%",
                      height: "56px",
                      backgroundColor: "#F4F4F4",
                      borderRadius: "10px",
                      padding: "0 48px 0 16px",
                      color: "#343434",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <Alert className="border-red-200 bg-red-50 w-full">
                  <AlertDescription className="text-red-800">
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              )}

              <LoginButton />
            </form>

            <div className="text-center mt-6" style={{ fontFamily: "Poppins, sans-serif" }}>
              <p className="text-sm" style={{ color: "#343434" }}>
                Não tem uma conta?{" "}
                <a href="/cadastro/paciente" className="text-blue-600 underline">
                  Cadastre-se aqui
                </a>
              </p>
            </div>

            <div className="absolute bottom-2 left-0 w-full text-center" style={{ fontFamily: "Poppins, sans-serif" }}>
               
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
