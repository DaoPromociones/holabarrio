// src/core/ports/out/negocio.repository.ts
import { Negocio } from "@/core/models/negocio";

export interface NegocioRepository {
  create(data: Omit<Negocio, "id" | "fechaCreacion" | "fechaActualizacion">): Promise<Negocio>;
  findById(id: string): Promise<Negocio | null>; // <-- CORREGIDO
  findAll(): Promise<Negocio[]>; // <-- CORREGIDO
  update(id: string, data: Partial<Omit<Negocio, "id">>): Promise<Negocio>;
  delete(id: string): Promise<void>;
}