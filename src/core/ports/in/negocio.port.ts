
import { Negocio } from "@/core/models/negocio";

export interface NegocioPortIn {
  getAllNegocios(): Promise<Negocio[]>;
  getNegocioById(id: string): Promise<Negocio | null>;
  createNegocio(negocio: Negocio): Promise<Negocio>;
  updateNegocio(id: string, negocio: Negocio): Promise<Negocio | null>;
  deleteNegocio(id: string): Promise<boolean>;
}
