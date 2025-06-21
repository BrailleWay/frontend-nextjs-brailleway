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
          return null;
        }

        // Primeiro tentamos autenticar como Paciente
        const patient = await prisma.paciente.findUnique({
          where: { email: credentials.email },
        });

        if (patient) {
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
          }
        }

        // Em seguida tentamos autenticar como Médico
        const doctor = await prisma.medico.findUnique({
          where: { email: credentials.email },
        });

        if (doctor) {
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
          }
        }

        // Se nenhum usuário for encontrado ou a senha estiver incorreta
        return null;
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
});