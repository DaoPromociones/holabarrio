// src/core/services/user.service.ts
import { User } from "@/core/models/user";
import { UserPort } from "@/core/ports/in/user.port";
import { UserRepository } from "@/core/ports/out/user.repository";

export class UserService implements UserPort {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
  
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
  
  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async create(data: Omit<User, "id" | "role" | "emailVerified" | "image">): Promise<User> {
    const dataWithDefaults = {
      ...data,
      emailVerified: null,
      image: null,
      role: "USER" as const,
    };
    return this.userRepository.create(dataWithDefaults);
  }

  async update(id: string, data: Partial<Omit<User, "id">>): Promise<User> {
    return this.userRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}