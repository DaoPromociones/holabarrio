// src/core/ports/in/localidad.port.ts
import { LocalidadRepository } from "@/core/ports/out/localidad.repository";

// Para este servicio, el puerto de entrada tendrá los mismos métodos
// que el repositorio, ya que no hay lógica de negocio compleja todavía.
export type LocalidadPort = LocalidadRepository;