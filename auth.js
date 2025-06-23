// auth.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma"; //
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e senha são obrigatórios");
        }

        try {
          // Primeiro tentamos autenticar como Paciente
          const patient = await prisma.paciente.findUnique({
            where: { email: credentials.email.toLowerCase().trim() },
          });

          if (patient) {
            // Verificar se o paciente está ativo
            if (!patient.ativo) {
              throw new Error("Conta desativada. Entre em contato com o suporte.");
            }

            const passwordsMatch = await bcrypt.compare(
              credentials.password,
              patient.senha
            );

            if (passwordsMatch) {
              return {
                id: patient.id.toString(),
                name: patient.nome,
                email: patient.email,
                role: "paciente",
              };
            } else {
              throw new Error("Senha incorreta");
            }
          }

          // Em seguida tentamos autenticar como Médico
          const doctor = await prisma.medico.findUnique({
            where: { email: credentials.email.toLowerCase().trim() },
          });

          if (doctor) {
            // Verificar se o médico está ativo
            if (!doctor.ativo) {
              throw new Error("Conta desativada. Entre em contato com o suporte.");
            }

            const passwordsMatch = await bcrypt.compare(
              credentials.password,
              doctor.senha
            );

            if (passwordsMatch) {
              return {
                id: doctor.id.toString(),
                name: doctor.nome,
                email: doctor.email,
                role: "medico",
              };
            } else {
              throw new Error("Senha incorreta");
            }
          }

          // Se nenhum usuário for encontrado
          throw new Error("Email não encontrado. Verifique se o email está correto ou cadastre-se.");
        } catch (error) {
          // Se já é um erro customizado, repassa
          if (error.message && !error.message.includes("prisma")) {
            throw error;
          }
          
          // Para erros do Prisma ou outros erros inesperados
          console.error("Erro durante autenticação:", error);
          throw new Error("Erro interno do servidor. Tente novamente.");
        }
      },
    }),
  ],
  callbacks: {
    // Adiciona o ID e a role do usuário ao token JWT e à sessão
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Redireciona para sua página de login customizada
  },
  // Configurações adicionais para melhor experiência
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  // Tratamento de erros personalizado
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`Usuário ${user.email} (${user.role}) fez login com sucesso`);
    },
    async signOut({ session, token }) {
      console.log("Usuário fez logout");
    },
  },
});