// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prismaAuth } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  // 1. Conectar NextAuth a nuestra BBDD de auth a través del Adaptador de Prisma
  adapter: PrismaAdapter(prismaAuth),

  // 2. Configurar los proveedores de autenticación
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    // Podríamos añadir más proveedores aquí (Email, etc.)
  ],

  // 3. Estrategia de Sesión
  session: {
    strategy: "jwt", // Usaremos JSON Web Tokens para las sesiones
  },

  // 4. Callbacks (para personalizar el comportamiento)
  callbacks: {
    async session({ session, token }) {
      // Añadir el ID del usuario y el rol al objeto de sesión
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Al iniciar sesión, persistir el ID y el rol en el token
      if (user) {
        token.id = user.id;
        token.role = user.role; // Asumiendo que 'role' está en tu modelo de User
      }
      return token;
    },
  },

  // 5. Secret para firmar los JWT
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };