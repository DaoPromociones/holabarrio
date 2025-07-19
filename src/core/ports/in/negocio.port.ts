// src/core/ports/in/negocio.port.ts
import { Negocio } from "@/core/models/negocio";

export interface NegocioPort {
  create(data: Omit<Negocio, "id" | "fechaCreacion" | "fechaActualizacion">): Promise<Negocio>;
  findById(id: string): Promise<Negocio | null>;
  findAll(): Promise<Negocio[]>;
  update(id: string, data: Partial<Omit<Negocio, "id">>): Promise<Negocio>;
  delete(id: string): Promise<void>; 
}
