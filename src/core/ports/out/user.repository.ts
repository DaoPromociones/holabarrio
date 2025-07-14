// src/core/ports/out/user.repository.ts
import { User } from "@/core/models/user";

export interface UserRepository {
  /**
   * Busca un usuario por su ID.
   * @param id El ID único del usuario.
   * @returns El usuario encontrado o null si no existe.
   */
  findById(id: string): Promise<User | null>;

  /**
   * Busca un usuario por su email.
   * @param email El email único del usuario.
   * @returns El usuario encontrado o null si no existe.
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Devuelve una lista de todos los usuarios.
   * @returns Un array de usuarios.
   */
  findAll(): Promise<User[]>;

  /**
   * Crea un nuevo usuario.
   * @param data Los datos del usuario a crear.
   * @returns El usuario recién creado.
   */
  create(data: Omit<User, 'id' | 'updatedAt'>): Promise<User>;

  /**
   * Actualiza un usuario existente.
   * @param id El ID del usuario a actualizar.
   * @param data Los datos a modificar.
   * @returns El usuario actualizado.
   */
  update(id: string, data: Partial<Omit<User, 'id' | 'updatedAt'>>): Promise<User>;

  /**
   * Elimina un usuario por su ID.
   * @param id El ID del usuario a eliminar.
   */
  delete(id: string): Promise<void>;
}