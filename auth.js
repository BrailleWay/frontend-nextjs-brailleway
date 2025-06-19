// auth.js - VERSÃO REFINADA

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        // MELHORIA 3: Envolver a lógica em um try...catch para robustez.
        try {
          const { email, senha } = credentials;
          if (!email || !senha) return null;

          let userDb = await prisma.paciente.findUnique({ where: { email: String(email) } });
          let userRole = "paciente";

          if (!userDb) {
            userDb = await prisma.medico.findUnique({ where: { email: String(email) } });
            userRole = "medico";
          }

          if (!userDb || !userDb.senha) {
            // MELHORIA 2: Mensagem de erro genérica.
            console.log("Falha na autenticação: Usuário não encontrado ou senha não definida para o email:", email);
            return null;
          }

          const senhasCombinam = await bcrypt.compare(String(senha), userDb.senha);

          if (senhasCombinam) {
            // MELHORIA 1: Retornar o campo 'name' padrão diretamente.
            // Isso simplifica os callbacks e segue a convenção do Auth.js.
            return {
              id: userDb.id,
              email: userDb.email,
              name: userDb.nome, // <-- Alinhado com o padrão 'name'.
              role: userRole,
            };
          }
          
          // MELHORIA 2: Mensagem de erro genérica.
          console.log("Falha na autenticação: Credenciais inválidas para o email:", email);
          return null;

        } catch (error) {
          console.error("Erro no processo de autorização:", error);
          // Em caso de erro no banco ou outra falha, não autenticar.
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // Agora que 'authorize' já retorna 'name', os callbacks ficam mais limpos e diretos.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});