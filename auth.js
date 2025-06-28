// auth.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./lib/prisma";
import bcrypt from "bcryptjs"; // bcryptjs continua aqui, pois é usado no lado do servidor

export const { handlers, auth, signIn, signOut } = NextAuth({
  // ❌ Remover a linha do adapter
  // adapter: PrismaAdapter(prisma), 

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
      // Sua função authorize está muito boa e não precisa de mudanças.
      // Ela busca corretamente por pacientes e médicos.
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          // Retornar null é uma prática comum para credenciais ausentes.
          return null;
        }

        try {
          const email = credentials.email.toLowerCase().trim();
          const password = credentials.password;

          // Buscar paciente
          const patient = await prisma.paciente.findUnique({ where: { email } });
          if (patient && patient.ativo) {
            const passwordsMatch = await bcrypt.compare(password, patient.senha);
            if (passwordsMatch) {
              return { id: patient.id.toString(), name: patient.nome, email: patient.email, role: "paciente" };
            }
          }

          // Buscar médico
          const doctor = await prisma.medico.findUnique({ where: { email } });
          if (doctor && doctor.ativo) {
            const passwordsMatch = await bcrypt.compare(password, doctor.senha);
            if (passwordsMatch) {
              return { id: doctor.id.toString(), name: doctor.nome, email: doctor.email, role: "medico" };
            }
          }
          
          // Se nenhum usuário foi encontrado ou a senha não bateu
          return null;

        } catch (error) {
          console.error("Erro durante autenticação:", error);
          // Retornar null em caso de erro interno
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // Seus callbacks estão perfeitos para adicionar o 'role' ao token e à sessão.
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
    // É uma boa prática definir uma página de erro, caso o login falhe
    error: '/login',
  },
});