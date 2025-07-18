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
  
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
  
  async createUser(data: Omit<User, "id" | "role" | "updatedAt" | "emailVerified">): Promise<User> {
    // Aquí podríamos añadir lógica de negocio, como validar los datos
    // o enviar un email de bienvenida usando un futuro EmailService.
    // Por ahora, delegamos directamente al repositorio.
    // El servicio se encarga de la lógica de negocio: asignar un rol por defecto.
    const dataWithRole = {
      ...data,
      emailVerified: null,
      role: "USER" as const,
    };
    return this.userRepository.create(dataWithRole);
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

  

  
}