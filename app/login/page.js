// app/login/page.js
import FormularioLogin from "@/components/forms/FormularioLogin";

export default function LoginPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Entrar na Plataforma</h1>
      <FormularioLogin />
    </div>
  );
}