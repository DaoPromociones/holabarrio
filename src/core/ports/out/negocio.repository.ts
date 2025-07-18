
import { Negocio } from "@/core/models/negocio";

export interface NegocioRepository {
  getAll(): Promise<Negocio[]>;
  getById(id: string): Promise<Negocio | null>;
  create(negocio: Negocio): Promise<Negocio>;
  update(id: string, negocio: Negocio): Promise<Negocio | null>;
  delete(id: string): Promise<boolean>;
}
