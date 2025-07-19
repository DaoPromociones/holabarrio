// src/core/ports/in/user.port.ts
import { User } from "@/core/models/user";

export interface UserPort {
  create(data: Omit<User, "id" | "role" | "emailVerified" | "image">): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, data: Partial<Omit<User, "id">>): Promise<User>;
  delete(id: string): Promise<void>;
  
}