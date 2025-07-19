// src/core/models/user.ts

// El enum ahora vive en el dominio, desacoplado de Prisma.
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  password?: string | null;

  image: string | null;
  nombreUsuario: string | null;
  role: UserRole;
}