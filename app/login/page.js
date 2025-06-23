// app/login/page.js
import { signIn } from "@/auth";
import { Button } from "@/components/ui/button"; //
import { Input } from "@/components/ui/input"; //
import { Label } from "@/components/ui/label"; //

export default function LoginPage() {
  async function handleLogin(formData) {
    "use server";
    try {
      await signIn("credentials", formData, { redirectTo: "/dashboard" });
    } catch (error) {
      // O erro de redirect é esperado e deve ser tratado pelo Next.js.
      // Verificamos se o erro é o específico de 'NEXT_REDIRECT'. Se for, o relançamos
      // para que o Next.js possa completar o redirecionamento.
      if (error.digest?.startsWith('NEXT_REDIRECT')) {
        throw error;
      }
      
      // Agora, tratamos os erros que são realmente problemas de login
      if (error.type === "CredentialsSignin") {
        console.error("Credenciais inválidas.");
        // No futuro, você pode retornar uma mensagem de erro aqui para exibir na tela.
        return;
      }

      // Para qualquer outro erro inesperado
      console.error("Erro desconhecido:", error);
    }
  }

  return (
    <>
      
      <div className="container mx-auto p-4 flex justify-center items-center h-screen">
      
      <form
        action={handleLogin}
        className="w-full max-w-sm p-8 space-y-6 bg-white shadow-md rounded-lg"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Entrar</h1>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input name="email" id="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input name="password" id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Entrar
        </Button>
      </form>
    </div>
    </>
  );
}