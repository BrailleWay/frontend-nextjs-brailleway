'use client';


import { useActionState } from 'react';
import { useFormStatus } from 'react-dom'; 
import { logar } from '@/lib/actions/login';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

/* ───────────────────────── Sub-componente: Botão de submit ───────────────────────── */
function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      /*  tailwind que vem da Página 1  */
      className="
        w-48 h-12 rounded-full
        shadow-[0px_4px_4px_#00000040]
        bg-gradient-to-r from-[#3E97F3] via-[#227CE7] to-[#47E0D0]
        font-semibold text-white text-lg
        flex items-center justify-center
        transition duration-200 hover:brightness-110
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      "
    >
      {pending ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          Entrando…
        </>
      ) : (
        'Entrar'
      )}
    </Button>
  );
}

/* ─────────────────────────── Componente principal ─────────────────────────── */
export default function LoginForm() {
  /*  ✅ useFormState devolve a mensagem de erro vinda da server action  */
  const [errorMessage, dispatch] = useActionState(logar, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="min-h-screen min-w-full flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/login/CaraLendoBraille.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="flex items-center justify-center w-full max-w-5xl">
        {/*  Card grandão com duas colunas  */}
        <div className="relative flex w-full max-w-5xl h-[730px] rounded-[32px] shadow-lg overflow-hidden">
          {/*  Lado decorativo (esquerdo) – apenas em telas ≥ md  */}
          <div
            className="hidden md:block w-1/2 h-full border-4 border-white rounded-l-[32px]"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.10)' }}
          />

          {/*  Lado funcional (direito)  */}
          <div className="w-full md:w-1/2 h-full bg-white rounded-[32px] md:rounded-l-none flex flex-col items-center justify-center relative">
            {/*  Logo e título  */}
            <div className="mb-4 flex flex-col items-center">
              <Image
                src="/home/brailleway_logo.webp"
                alt="Logo BrailleWay"
                width={180}
                height={60}
                priority
                className="mb-4"
              />
              <h1 className="font-poppins text-[28px] font-normal text-[#343434] tracking-[-0.06em] text-center mb-3">
                Faça login para acessar sua conta
              </h1>
              <p className="font-poppins text-sm font-light text-[#343434] tracking-[-0.04em] text-center mb-6">
                Informe seu email e senha para continuar no BrailleWay.
              </p>
            </div>

            {/*  Formulário  */}
            <form
              action={dispatch}        /* 👈 mesmo padrão da Página 2 */
              className="w-full flex flex-col gap-8 items-center"
              style={{ maxWidth: 400 }}
            >
              <div className="w-full">
                <Label htmlFor="email" className="block font-medium mb-2 text-base text-[#343434]">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"         /* 👈 name é obrigatório p/ server action */
                  type="email"
                  placeholder="Informe seu email"
                  required
                  className="
                    w-full h-14 rounded-[10px] bg-[#F4F4F4] px-4
                    text-[#343434] placeholder:text-[#737373] focus-visible:ring-2
                  "
                />
              </div>

              <div className="w-full">
                <Label htmlFor="password" className="block font-medium mb-2 text-base text-[#343434]">
                  Senha
                </Label>
                <div className="relative h-14">
                  <Input
                    id="password"
                    name="password"      /* 👈 idem */
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    required
                    className="
                      w-full h-14 rounded-[10px] bg-[#F4F4F4] pr-12 pl-4
                      text-[#343434] placeholder:text-[#737373] focus-visible:ring-2
                    "
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    className="
                      absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full
                      text-black/70 hover:text-black focus:outline-none focus:ring-2
                    "
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/*  Feedback de erro vindo da server action  */}
              {errorMessage && (
                <Alert className="w-full bg-red-50 border-red-200">
                  <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
                </Alert>
              )}

              <LoginButton />
            </form>

            {/*  Link para cadastro  */}
            <div className="mt-6 text-center font-poppins text-sm text-[#343434]">
              Não tem uma conta?{' '}
              <a href="/cadastro/paciente" className="text-blue-600 underline">
                Cadastre-se aqui
              </a>
            </div>

            <p className="absolute bottom-2 w-full text-center font-poppins text-xs text-[#929292]">
              © 2025 BrailleWay. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
