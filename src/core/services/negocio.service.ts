
import { Negocio } from "@/core/models/negocio";
import { NegocioPortIn } from "@/core/ports/in/negocio.port";
import { NegocioRepository } from "@/core/ports/out/negocio.repository";

export class NegocioService implements NegocioPortIn {
  constructor(private readonly negocioRepository: NegocioRepository) {}

  public async getAllNegocios(): Promise<Negocio[]> {
    return await this.negocioRepository.getAll();
  }

  public async getNegocioById(id: string): Promise<Negocio | null> {
    return await this.negocioRepository.getById(id);
  }

  public async createNegocio(negocio: Negocio): Promise<Negocio> {
    return await this.negocioRepository.create(negocio);
  }

  public async updateNegocio(id: string, negocio: Negocio): Promise<Negocio | null> {
    return await this.negocioRepository.update(id, negocio);
  }

  public async deleteNegocio(id: string): Promise<boolean> {
    return await this.negocioRepository.delete(id);
  }
}
