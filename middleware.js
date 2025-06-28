// middleware.js
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const userRole = req.auth?.user?.role;
  const isLoggedIn = !!req.auth;

  // Se o usuário está logado e tenta acessar a página de login, redirecione-o
  if (isLoggedIn && nextUrl.pathname === "/login") {
    const redirectUrl = userRole === 'medico' ? '/consultas' : '/consultas';
    return NextResponse.redirect(new URL(redirectUrl, nextUrl));
  }

  
  // Protegendo a rota de consultas do paciente
  if (nextUrl.pathname.startsWith("/consultas") && !isLoggedIn) {
     return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (nextUrl.pathname.startsWith("/perfil") && !isLoggedIn) {
     return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Se nenhuma das condições acima for atendida, continua a navegação
  return NextResponse.next();
});

// O matcher é crucial para evitar loops de redirecionamento e
// garantir que o middleware só rode nas páginas da aplicação.
export const config = {
  matcher: [
    '/login',
    '/consultas/:path*',
    '/perfil',
  ],
}