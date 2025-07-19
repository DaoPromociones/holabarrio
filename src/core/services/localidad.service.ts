// src/core/services/localidad.service.ts
import { Localidad } from "@/core/models/localidad";
import { LocalidadPort } from "../ports/in/localidad.port";
import { LocalidadRepository } from "../ports/out/localidad.repository";

export class LocalidadService implements LocalidadPort {
  
  constructor(private readonly localidadRepository: LocalidadRepository) {}

  async create(data: Omit<Localidad, "id" | "fechaCreacion" | "fechaActualizacion">): Promise<Localidad> {
    return this.localidadRepository.create(data);
  }

  async findById(id: number): Promise<Localidad | null> {
    return this.localidadRepository.findById(id);
  }

  async findByName(nombre: string): Promise<Localidad | null> {
    return this.localidadRepository.findByName(nombre);
  }
  
  async findAll(): Promise<Localidad[]> {
    return this.localidadRepository.findAll();
  }

  async update(id: number, data: Partial<Omit<Localidad, "id">>): Promise<Localidad> {
    return this.localidadRepository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    await this.localidadRepository.delete(id);
  }
}