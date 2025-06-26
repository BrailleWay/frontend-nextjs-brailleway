// auth.js - Configuração simplificada do Auth.js v5
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
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
          const email = credentials.email.toLowerCase().trim();
          const password = credentials.password;

          // Buscar paciente primeiro
          const patient = await prisma.paciente.findUnique({
            where: { email },
          });

          if (patient && patient.ativo) {
            const passwordsMatch = await bcrypt.compare(password, patient.senha);
            if (passwordsMatch) {
              return {
                id: patient.id.toString(),
                name: patient.nome,
                email: patient.email,
                role: "paciente",
              };
            }
          }

          // Buscar médico se paciente não encontrado
          const doctor = await prisma.medico.findUnique({
            where: { email },
          });

          if (doctor && doctor.ativo) {
            const passwordsMatch = await bcrypt.compare(password, doctor.senha);
            if (passwordsMatch) {
              return {
                id: doctor.id.toString(),
                name: doctor.nome,
                email: doctor.email,
                role: "medico",
              };
            }
          }

          // Se chegou aqui, credenciais inválidas
          throw new Error("Email ou senha incorretos");
        } catch (error) {
          console.error("Erro durante autenticação:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
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
    signIn: "/login",
  },
  events: {
    async signIn({ user }) {
      console.log(`✅ Login: ${user.email} (${user.role})`);
    },
    async signOut() {
      console.log("✅ Logout realizado");
    },
  },
});