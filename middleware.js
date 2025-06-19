// middleware.js

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// O middleware principal apenas exporta a funcionalidade de autenticação
// que contém toda a lógica de autorização do auth.config.js
export default NextAuth(authConfig).auth;

export const config = {
  // A regex abaixo faz com que o middleware rode em TODAS as rotas,
  // EXCETO aquelas que são para arquivos estáticos (como imagens, css),
  // ou rotas internas da API do Next.js.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};