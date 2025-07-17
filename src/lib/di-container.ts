// src/lib/di-container.ts
import { UserService } from "@/core/services/user.service";
import { UserPort } from "@/core/ports/in/user.port";
import { PrismaUserRepositoryImpl } from "@/repositories/prisma.user.repository.impl";
import { LocalidadService } from "@/core/services/localidad.service";
import { LocalidadPort } from "@/core/ports/in/localidad.port";
import { PrismaLocalidadRepositoryImpl } from "@/repositories/prisma.localidad.repository.impl";
import { NegocioService } from "@/core/services/negocio.service";
import { NegocioPortIn } from "@/core/ports/in/negocio.port";
import { PrismaNegocioRepositoryImpl } from "@/repositories/prisma.negocio.repository.impl";

// Asumimos que los servicios de Email y Payment se configurarán más adelante
// y hemos mantenido sus repositorios "dummy" o reales si las claves existen.
// ... (imports de email y payment si se mantienen)

export type ServiceMap = {
  UserService: UserPort;
  LocalidadService: LocalidadPort;
  NegocioService: NegocioPortIn;
  // EmailService: EmailPort;
  // PaymentService: PaymentPortIn;
};

class DIContainer {
  private services: Map<keyof ServiceMap, any> = new Map();

  constructor() {
    this.initializeServices();
  }

  private initializeServices() {
    // --- REPOSITORIOS ---
    const userRepository = new PrismaUserRepositoryImpl();
    const localidadRepository = new PrismaLocalidadRepositoryImpl();
    const negocioRepository = new PrismaNegocioRepositoryImpl();
    // ... (lógica para email y payment repos)

    // --- SERVICIOS ---
    const userService = new UserService(userRepository);
    const localidadService = new LocalidadService(localidadRepository);
    const negocioService = new NegocioService(negocioRepository);
    // ... (lógica para email y payment services)

    // --- REGISTRO ---
    this.services.set("UserService", userService);
    this.services.set("LocalidadService", localidadService);
    this.services.set("NegocioService", negocioService);
    // ... (registro para email y payment services)
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

// --- INSTANCIAS ---
export const userServiceInstance: UserPort = diContainer.get("UserService");
export const localidadServiceInstance: LocalidadPort = diContainer.get("LocalidadService");
export const negocioServiceInstance: NegocioPortIn = diContainer.get("NegocioService");