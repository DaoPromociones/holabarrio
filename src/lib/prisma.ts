// src/lib/prisma.ts
import { PrismaClient as PrismaClientAuth } from '@prisma/client-auth';
import { PrismaClient as PrismaClientApp } from '@prisma/client-app';

// Se usa declare global para evitar múltiples instancias durante el hot-reloading en desarrollo
declare global {
  var prismaAuth: PrismaClientAuth | undefined;
  var prismaApp: PrismaClientApp | undefined;
}

export const prismaAuth = global.prismaAuth || new PrismaClientAuth();
export const prismaApp = global.prismaApp || new PrismaClientApp();

if (process.env.NODE_ENV !== 'production') {
  global.prismaAuth = prismaAuth;
  global.prismaApp = prismaApp;
}