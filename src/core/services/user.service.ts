// src/core/services/user.service.ts
import { User } from "@/core/models/user";
import { UserPort } from "@/core/ports/in/user.port";
import { UserRepository } from "@/core/ports/out/user.repository";

export class UserService implements UserPort {
  // El servicio depende de la INTERFAZ del repositorio, no de la implementación.
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: string): Promise<User | null> {
    // La lógica de negocio podría ir aquí. Por ahora, solo llamamos al repositorio.
    return this.userRepository.findById(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async updateUser(id: string, data: Partial<Omit<User, "id" | "updatedAt">>): Promise<User> {
    return this.userRepository.update(id, data);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  // ... (dentro de la clase UserService)

  async createUser(data: Omit<User, "id" | "updatedAt" | "role">): Promise<User> {
    // Aquí podríamos añadir lógica de negocio, como validar los datos
    // o enviar un email de bienvenida usando un futuro EmailService.
    // Por ahora, delegamos directamente al repositorio.
    return this.userRepository.create(data);
  }
}