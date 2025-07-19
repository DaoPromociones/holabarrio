import { Negocio as CoreNegocio } from "@/core/models/negocio";
import { NegocioRepository } from "@/core/ports/out/negocio.repository";
import { prismaApp } from "@/lib/prisma";
import {
  PrismaClient as PrismaClientApp,
  Negocio as PrismaNegocio,
  Prisma,
} from "@prisma/client-app";

export class PrismaNegocioRepositoryImpl implements NegocioRepository {
  
  constructor(private prisma: PrismaClientApp = prismaApp) {}

  private mapToDomain(
    prismaNegocio: PrismaNegocio & {
      categorias?: { categoria: { id: number } }[];
    }
  ): CoreNegocio {
    return {
      id: prismaNegocio.id,
      propietarioId: prismaNegocio.propietarioId,
      localidadId: prismaNegocio.localidadId,
      nombreNegocio: prismaNegocio.nombreNegocio as CoreNegocio["nombreNegocio"],
      descripcion: prismaNegocio.descripcion as CoreNegocio["descripcion"],
      direccionFisica: prismaNegocio.direccionFisica,
      latitud: prismaNegocio.latitud ? prismaNegocio.latitud.toNumber() : null,
      longitud: prismaNegocio.longitud ? prismaNegocio.longitud.toNumber() : null,
      telefono: prismaNegocio.telefono,
      correoElectronicoNegocio: prismaNegocio.correoElectronicoNegocio,
      sitioWebUrl: prismaNegocio.sitioWebUrl,
      redesSociales: prismaNegocio.redesSociales as CoreNegocio["redesSociales"],
      galeriaFotosUrls: prismaNegocio.galeriaFotosUrls,
      horarioApertura: prismaNegocio.horarioApertura as CoreNegocio["horarioApertura"],
      estaActivo: prismaNegocio.estaActivo,
      planSuscripcion: prismaNegocio.planSuscripcion,
      fechaCreacion: prismaNegocio.fechaCreacion,
      fechaActualizacion: prismaNegocio.fechaActualizacion,
      categoryIds: prismaNegocio.categorias?.map(c => c.categoria.id) || [],
    };
  }

  async create(data: Omit<CoreNegocio, "id" | "fechaCreacion" | "fechaActualizacion">): Promise<CoreNegocio> {
    const { categoryIds, ...negocioData } = data;
    const newNegocio = await this.prisma.negocio.create({
      data: {
        ...negocioData,
        nombreNegocio: negocioData.nombreNegocio ?? Prisma.JsonNull,
        descripcion: negocioData.descripcion ?? Prisma.JsonNull,
        redesSociales: negocioData.redesSociales ?? Prisma.JsonNull,
        horarioApertura: negocioData.horarioApertura ?? Prisma.JsonNull,
        categorias: {
          create: categoryIds?.map((id: number) => ({
            categoria: { connect: { id } },
          })),
        },
      },
    });
    return this.mapToDomain(newNegocio);
  }
  
  // ... (métodos findById y findAll se quedan igual, pero necesitarán el nuevo mapToDomain)

  async update(id: string, data: Partial<Omit<CoreNegocio, "id">>): Promise<CoreNegocio> {
    // ... (implementación de update)
    return {} as CoreNegocio; // Placeholder, necesita implementación completa
  }

  async delete(id: string): Promise<void> {
    await this.prisma.negocio.delete({ 
      where: { id } 
    });
    // No hay 'return' aquí.
  }

  // Métodos findById y findAll también deben ser implementados aquí
  // ...

  async findById(id: string): Promise<CoreNegocio | null> {
    const negocio = await this.prisma.negocio.findUnique({
      where: { id },
      include: { categorias: { include: { categoria: true } } },
    });
    return negocio ? this.mapToDomain(negocio) : null;
  }

  async findAll(): Promise<CoreNegocio[]> {
    const negocios = await this.prisma.negocio.findMany({
      include: { categorias: { include: { categoria: true } } },
    });
    return negocios.map(this.mapToDomain);
  }
}
