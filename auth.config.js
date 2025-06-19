// auth.config.js

export const authConfig = {
  pages: {
    signIn: "/login", // Para onde redirecionar se o acesso for negado
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role;
      const { pathname } = nextUrl;

      // === DEFINIÇÃO DAS ROTAS POR PERFIL ===
      const pacienteRoutes = [
        "/dashboard/paciente",
        "/consultas/minhas-consultas",
        "/perfil",
      ];
      const medicoRoutes = [
        "/dashboard/medico",
        "/agenda/minha-disponibilidade",
        "/perfil",
      ];
      const publicRoutes = ["/login", "/cadastro/paciente", "/cadastro/medico", "/"];

      // === LÓGICA DE REDIRECIONAMENTO ===

      // 1. Redirecionar usuários já logados para longe das páginas públicas
      if (publicRoutes.includes(pathname) && isLoggedIn) {
        if (userRole === "paciente") {
          return Response.redirect(new URL("/dashboard/paciente", nextUrl));
        }
        if (userRole === "medico") {
          return Response.redirect(new URL("/dashboard/medico", nextUrl));
        }
      }

      // 2. Proteger as rotas de Paciente
      if (pacienteRoutes.some(route => pathname.startsWith(route))) {
        if (isLoggedIn && userRole === "paciente") {
          return true; // Permite o acesso
        }
        return false; // Nega acesso e redireciona para /login
      }

      // 3. Proteger as rotas de Médico
      if (medicoRoutes.some(route => pathname.startsWith(route))) {
        if (isLoggedIn && userRole === "medico") {
          return true; // Permite o acesso
        }
        return false; // Nega acesso e redireciona para /login
      }

      // 4. Permite o acesso a todas as outras rotas (se houver)
      // e às rotas públicas para usuários deslogados
      return true;
    },
  },
  providers: [], // Os provedores devem ficar no arquivo auth.js principal
};