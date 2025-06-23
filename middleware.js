// middleware.js
import { auth } from "@/auth";

export default auth((req) => {
  // O `auth` do middleware já lida com o redirecionamento para a página de login
  // se o usuário não estiver autenticado e tentar acessar uma rota protegida.
});

// O `matcher` define quais rotas serão protegidas pelo middleware.
export const config = {
  matcher: [
    // Protege todas as rotas, exceto as de API, as estáticas e a da home/login
    "/((?!api|_next/static|_next/image|favicon.ico|homepage|login|cadastro).*)",
  ],
};