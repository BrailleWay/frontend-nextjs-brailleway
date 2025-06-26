// middleware.js - Auth.js v5
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Rotas protegidas que requerem autenticação
  const protectedRoutes = [
    "/dashboard",
    "/perfil", 
    "/consultas",
    "/procurar-especialista",
    "/homepage"
  ];

  // Rotas públicas que redirecionam para homepage se logado
  const publicRoutes = ["/", "/login"];

  // Se logado e tentando acessar rota pública, redireciona para homepage
  if (isLoggedIn && publicRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/homepage", nextUrl));
  }

  // Se não logado e tentando acessar rota protegida, redireciona para login
  if (!isLoggedIn && protectedRoutes.some(route => nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

// Configurar quais rotas usar o middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};