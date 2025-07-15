// src/lib/di-container.ts
import { UserService } from "@/core/services/user.service";
import { UserPort } from "@/core/ports/in/user.port";
import { PrismaUserRepositoryImpl } from "@/repositories/prisma.user.repository.impl";
import { EmailService } from "@/core/services/email.service";
import { EmailPort } from "@/core/ports/in/email.port";
import { EmailRepository } from "@/core/ports/out/email.repository";
import { ResendEmailRepositoryImpl } from "@/repositories/resend.email.repository.impl";
import { DummyEmailRepositoryImpl } from "@/repositories/dummy.email.repository.impl";

export type ServiceMap = {
  UserService: UserPort;
  EmailService: EmailPort;
};

class DIContainer {
  private services: Map<keyof ServiceMap, ServiceMap[keyof ServiceMap]> = new Map();

  constructor() {
    this.initializeServices();
  }

  private initializeServices() {
    // Repositorios
    const userRepository = new PrismaUserRepositoryImpl();
    
    let emailRepository: EmailRepository;
    if (process.env.RESEND_API_KEY && process.env.NODE_ENV === 'production') {
      emailRepository = new ResendEmailRepositoryImpl();
    } else {
      console.log("WARN: Usando DummyEmailRepository. Los emails no se enviarán.");
      emailRepository = new DummyEmailRepositoryImpl();
    }

    // Servicios
    const userService = new UserService(userRepository);
    const emailService = new EmailService(emailRepository);

    // Registro de servicios
    this.services.set("UserService", userService);
    this.services.set("EmailService", emailService);
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

// Instancias exportadas
export const userServiceInstance: UserPort = diContainer.get("UserService");
export const emailServiceInstance: EmailPort = diContainer.get("EmailService");