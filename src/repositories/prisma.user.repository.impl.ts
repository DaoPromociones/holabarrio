// src/repositories/prisma.user.repository.impl.ts

import { PrismaClient as PrismaClientAuth, User as PrismaUser, UserRole } from '@prisma/client-auth';
import { User as CoreUser, UserRole as CoreUserRole } from "@/core/models/user";
import { UserRepository } from "@/core/ports/out/user.repository";
import { prismaAuth } from "@/lib/prisma";

export class PrismaUserRepositoryImpl implements UserRepository {
  
  constructor(private prisma: PrismaClientAuth = prismaAuth) {}

  /**
   * Mapea un objeto de usuario de Prisma a un objeto de usuario del dominio (core).
   * @param prismaUser El objeto de usuario devuelto por Prisma.
   * @returns Un objeto de usuario que cumple con la interfaz del core.
   */
  private mapToDomain(prismaUser: PrismaUser): CoreUser {
    return {
      id: prismaUser.id,
      name: prismaUser.name,
      email: prismaUser.email,
      emailVerified: prismaUser.emailVerified,
      password: prismaUser.password,
      image: prismaUser.image,
      nombreUsuario: prismaUser.nombreUsuario,
      
      // --- MAPEANDO EL ENUM ---
      // Casteamos el tipo, ya que sabemos que los valores son idénticos ("USER", "ADMIN")
      role: prismaUser.role as CoreUserRole,
    };
  }

  async findById(id: string): Promise<CoreUser | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
    });
    
    return prismaUser ? this.mapToDomain(prismaUser) : null;
  }

  async findByEmail(email: string): Promise<CoreUser | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email },
    });
    return prismaUser ? this.mapToDomain(prismaUser) : null;
  }

  async findAll(): Promise<CoreUser[]> {
    const prismaUsers = await this.prisma.user.findMany();
    return prismaUsers.map(prismaUser => this.mapToDomain(prismaUser));
  }

  async create(data: Omit<CoreUser, 'id' | 'role' | 'emailVerified'>): Promise<CoreUser> {
    const prismaUser = await this.prisma.user.create({
      data: {
        ...data,
        role: 'USER', // Asignamos un rol por defecto en la creación
      }
    });
    return this.mapToDomain(prismaUser);
  }

  async update(id: string, data: Partial<Omit<CoreUser, 'id'>>): Promise<CoreUser> {
    const prismaUser = await this.prisma.user.update({
      where: { id },
      data,
    });
    return this.mapToDomain(prismaUser);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
    // No devuelve nada, como dicta la interfaz.
  }
}