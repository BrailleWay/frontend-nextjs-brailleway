// middleware.js
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Se o usuário está logado e tenta acessar a página de login, redireciona para homepage
  if (isLoggedIn && nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/homepage", nextUrl));
  }

  // Se o usuário está logado e tenta acessar a página raiz, redireciona para homepage
  if (isLoggedIn && nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/homepage", nextUrl));
  }

  // Se o usuário não está logado e tenta acessar rotas protegidas, redireciona para login
  if (!isLoggedIn && isProtectedRoute(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

// Função para verificar se uma rota é protegida
function isProtectedRoute(pathname) {
  const protectedRoutes = [
    "/dashboard",
    "/consultas",
    "/perfil",
    "/procurar-especialista",
  ];
  
  return protectedRoutes.some(route => pathname.startsWith(route));
}

// O `matcher` define quais rotas serão processadas pelo middleware.
export const config = {
  matcher: [
    // Processa todas as rotas, exceto as de API, as estáticas e assets
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};