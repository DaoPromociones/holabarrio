// src/lib/authOptions.ts

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prismaAuth } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prismaAuth),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciales inválidas");
        }

        const user = await prismaAuth.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error("Credenciales inválidas");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Credenciales inválidas");
        }

        return user;
      }
    })
  ],
  


  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      // Para inicios de sesión OAuth (no credenciales)
      if (account && account.provider !== 'credentials') {
        const existingUser = await prismaAuth.user.findUnique({
          where: { email: user.email! },
        });

        // Si ya existe un usuario con ese email
        if (existingUser) {
          const accountLinked = await prismaAuth.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });

          // Si la cuenta específica del proveedor no existe, la creamos para vincularla
          if (!accountLinked) {
            await prismaAuth.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            });
          }
        }
      }
      return true; // Permitir siempre el inicio de sesión
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.role = user.role;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};