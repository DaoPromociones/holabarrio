// src/lib/di-container.ts
import { UserService } from "../core/services/user.service";
import { UserPort } from "../core/ports/in/user.port";
import { PrismaUserRepositoryImpl } from "@/repositories/prisma.user.repository.impl";

// Por ahora solo definimos el UserService.
// Añadiremos otros servicios aquí a medida que los construyamos.
export type ServiceMap = {
  UserService: UserPort;
};

class DIContainer {
  private services: Map<keyof ServiceMap, ServiceMap[keyof ServiceMap]> = new Map();

  constructor() {
    this.initializeServices();
  }

  private initializeServices() {
    // Repositories
    const userRepository = new PrismaUserRepositoryImpl();

    // Services
    const userService = new UserService(userRepository);

    // Register services
    this.services.set("UserService", userService);
  }

  public get<K extends keyof ServiceMap>(serviceName: K): ServiceMap[K] {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service as ServiceMap[K];
  }
}

export const diContainer = new DIContainer();

// Exportamos la instancia para usarla en nuestras API Routes.
export const userServiceInstance: UserPort = diContainer.get("UserService");