
import { prismaApp } from "@/lib/prisma";
import { Negocio } from "@/core/models/negocio";
import { NegocioRepository } from "@/core/ports/out/negocio.repository";

// Mapper para convertir el modelo de Prisma a nuestro modelo de dominio
const toModel = (negocio: any): Negocio => {
  return {
    ...
    negocio,
    id: negocio.id.toString(), // Asegurarse de que los IDs son strings
  };
};

export class PrismaNegocioRepositoryImpl implements NegocioRepository {
  async getAll(): Promise<Negocio[]> {
    const negocios = await prismaApp.negocio.findMany();
    return negocios.map(toModel);
  }

  async getById(id: string): Promise<Negocio | null> {
    const negocio = await prismaApp.negocio.findUnique({ where: { id } });
    if (!negocio) return null;
    return toModel(negocio);
  }

  async create(negocio: Negocio): Promise<Negocio> {
    const newNegocio = await prismaApp.negocio.create({ data: negocio });
    return toModel(newNegocio);
  }

  async update(id: string, negocio: Negocio): Promise<Negocio | null> {
    try {
      const updatedNegocio = await prismaApp.negocio.update({
        where: { id },
        data: negocio,
      });
      return toModel(updatedNegocio);
    } catch (error) {
      // Manejar error si el negocio no se encuentra
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prismaApp.negocio.delete({ where: { id } });
      return true;
    } catch (error) {
      return false;
    }
  }
}
