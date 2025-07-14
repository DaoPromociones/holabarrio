// src/core/ports/in/user.port.ts
import { User } from "@/core/models/user";

export interface UserPort {
  /**
   * Obtiene un usuario por su ID.
   * @param id El ID del usuario a buscar.
   * @returns Una promesa que resuelve al usuario o null si no se encuentra.
   */
  getUserById(id: string): Promise<User | null>;

  /**
   * Obtiene todos los usuarios del sistema.
   * @returns Una promesa que resuelve a un array con todos los usuarios.
   */
  getAllUsers(): Promise<User[]>;

  /**
   * Actualiza los datos de un usuario.
   * @param id El ID del usuario a actualizar.
   * @param data Los datos parciales del usuario a modificar.
   * @returns Una promesa que resuelve al usuario con los datos actualizados.
   */
  updateUser(id: string, data: Partial<Omit<User, 'id' | 'updatedAt'>>): Promise<User>;

  /**
   * Elimina un usuario del sistema.
   * @param id El ID del usuario a eliminar.
   * @returns Una promesa que se resuelve cuando el usuario ha sido eliminado.
   */
  deleteUser(id: string): Promise<void>;

    /**
   * Crea un nuevo usuario en el sistema.
   * @param data Los datos del usuario a crear.
   * @returns Una promesa que resuelve al usuario recién creado.
   */
  createUser(data: Omit<User, 'id' | 'updatedAt' | 'role'>): Promise<User>;
}