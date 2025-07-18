// next-auth.d.ts
import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  // Extendemos el tipo User base para incluir el rol
  interface User {
    role: UserRole;
  }
}