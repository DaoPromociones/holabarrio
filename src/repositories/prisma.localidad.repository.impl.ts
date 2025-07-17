// src/repositories/prisma.localidad.repository.impl.ts
import { Localidad as CoreLocalidad } from "@/core/models/localidad";
import { LocalidadRepository } from "@/core/ports/out/localidad.repository";
import { prismaApp } from "@/lib/prisma";
import { PrismaClient as PrismaClientApp, Localidad as PrismaLocalidad } from '@prisma/client-app';

export class PrismaLocalidadRepositoryImpl implements LocalidadRepository {
  
  constructor(private prisma: PrismaClientApp = prismaApp) {}

  private mapToDomain(prismaLocalidad: PrismaLocalidad): CoreLocalidad {
    return {
      ...prismaLocalidad,
      // Prisma devuelve Decimal, lo convertimos a número para nuestro modelo
      latitudCentro: prismaLocalidad.latitudCentro ? prismaLocalidad.latitudCentro.toNumber() : null,
      longitudCentro: prismaLocalidad.longitudCentro ? prismaLocalidad.longitudCentro.toNumber() : null,
    };
  }

  async create(data: Omit<CoreLocalidad, "id">): Promise<CoreLocalidad> {
    const prismaLocalidad = await this.prisma.localidad.create({ data });
    return this.mapToDomain(prismaLocalidad);
  }

  async findById(id: number): Promise<CoreLocalidad | null> {
    const prismaLocalidad = await this.prisma.localidad.findUnique({ where: { id } });
    return prismaLocalidad ? this.mapToDomain(prismaLocalidad) : null;
  }

  async findByName(nombre: string): Promise<CoreLocalidad | null> {
    const prismaLocalidad = await this.prisma.localidad.findUnique({ where: { nombreLocalidad: nombre } });
    return prismaLocalidad ? this.mapToDomain(prismaLocalidad) : null;
  }
  
  async findAll(): Promise<CoreLocalidad[]> {
    const prismaLocalidades = await this.prisma.localidad.findMany();
    return prismaLocalidades.map(this.mapToDomain);
  }

  async update(id: number, data: Partial<Omit<CoreLocalidad, "id">>): Promise<CoreLocalidad> {
    const prismaLocalidad = await this.prisma.localidad.update({ where: { id }, data });
    return this.mapToDomain(prismaLocalidad);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.localidad.delete({ where: { id } });
  }
}