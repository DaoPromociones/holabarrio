// src/core/services/negocio.service.ts
import { Negocio } from "@/core/models/negocio";
import { NegocioPort } from "../ports/in/negocio.port";
import { NegocioRepository } from "../ports/out/negocio.repository";

export class NegocioService implements NegocioPort {
  constructor(private readonly negocioRepository: NegocioRepository) {}

  async create(data: Omit<Negocio, "id" | "fechaCreacion" | "fechaActualizacion">): Promise<Negocio> {
    return this.negocioRepository.create(data);
  }

  async findById(id: string): Promise<Negocio | null> {
    return this.negocioRepository.findById(id);
  }

  async findAll(): Promise<Negocio[]> {
    return this.negocioRepository.findAll();
  }

  async update(id: string, data: Partial<Omit<Negocio, "id">>): Promise<Negocio> {
    return this.negocioRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.negocioRepository.delete(id);
  }
}