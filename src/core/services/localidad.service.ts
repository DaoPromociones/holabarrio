// src/core/services/localidad.service.ts
import { Localidad } from "@/core/models/localidad";
import { LocalidadPort } from "../ports/in/localidad.port";
import { LocalidadRepository } from "../ports/out/localidad.repository";

export class LocalidadService implements LocalidadPort {
  
  constructor(private readonly localidadRepository: LocalidadRepository) {}

  create(data: Omit<Localidad, "id">): Promise<Localidad> {
    // Aquí iría la lógica de negocio, por ahora delegamos.
    return this.localidadRepository.create(data);
  }

  findById(id: number): Promise<Localidad | null> {
    return this.localidadRepository.findById(id);
  }

  findByName(nombre: string): Promise<Localidad | null> {
    return this.localidadRepository.findByName(nombre);
  }
  
  findAll(): Promise<Localidad[]> {
    return this.localidadRepository.findAll();
  }

  update(id: number, data: Partial<Omit<Localidad, "id">>): Promise<Localidad> {
    return this.localidadRepository.update(id, data);
  }

  delete(id: number): Promise<void> {
    return this.localidadRepository.delete(id);
  }
}