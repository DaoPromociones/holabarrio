// src/core/models/user.ts
import { UserRole } from "@prisma/client-auth";

// Esta interfaz ahora es un reflejo 1:1 de nuestro modelo User en schema.prisma.
export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  nombreUsuario: string | null;
  role: UserRole;
}