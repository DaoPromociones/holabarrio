// src/core/ports/out/localidad.repository.ts
import { Localidad } from "@/core/models/localidad"; // Crearemos este modelo en el siguiente paso

export interface LocalidadRepository {
  /**
   * Crea una nueva localidad en la base de datos.
   * @param data Los datos de la localidad a crear.
   * @returns La localidad recién creada.
   */
  create(data: Omit<Localidad, "id">): Promise<Localidad>;

  /**
   * Busca una localidad por su ID.
   * @param id El ID único de la localidad.
   * @returns La localidad encontrada o null si no existe.
   */
  findById(id: number): Promise<Localidad | null>;

  /**
   * Busca una localidad por su nombre.
   * @param nombre El nombre único de la localidad.
   * @returns La localidad encontrada o null si no existe.
   */
  findByName(nombre: string): Promise<Localidad | null>;
  
  /**
   * Devuelve una lista de todas las localidades.
   * @returns Un array de todas las localidades.
   */
  findAll(): Promise<Localidad[]>;

  /**
   * Actualiza una localidad existente.
   * @param id El ID de la localidad a actualizar.
   * @param data Los datos a modificar.
   * @returns La localidad actualizada.
   */
  update(id: number, data: Partial<Omit<Localidad, "id">>): Promise<Localidad>;

  /**
   * Elimina una localidad por su ID.
   * @param id El ID de la localidad a eliminar.
   */
  delete(id: number): Promise<void>;
}