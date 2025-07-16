// src/lib/di-container.ts
import { UserService } from "@/core/services/user.service";
import { UserPort } from "@/core/ports/in/user.port";
import { PrismaUserRepositoryImpl } from "@/repositories/prisma.user.repository.impl";

import { EmailService } from "@/core/services/email.service";
import { EmailPort } from "@/core/ports/in/email.port";
import { EmailRepository } from "@/core/ports/out/email.repository";
import { ResendEmailRepositoryImpl } from "@/repositories/resend.email.repository.impl";
import { DummyEmailRepositoryImpl } from "@/repositories/dummy.email.repository.impl";

import { PaymentService } from "@/core/services/payment.service";
import { PaymentPortIn } from "@/core/ports/in/payment.port"; // <-- CORRECCIÓN 1: Nombre del tipo
import { PaymentRepository } from "@/core/ports/out/payment.repository";
import { StripePaymentRepositoryImpl } from "@/repositories/stripe.payment.repository";
import { DummyPaymentRepositoryImpl as DummyPaymentRepo } from "@/repositories/dummy.payment.repository.impl";

export type ServiceMap = {
  UserService: UserPort;
  EmailService: EmailPort;
  PaymentService: PaymentPortIn; // <-- CORRECCIÓN 1: Nombre del tipo
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
    if (process.env.RESEND_API_KEY) {
      emailRepository = new ResendEmailRepositoryImpl();
    } else {
      console.log("WARN: RESEND_API_KEY no configurada. Usando DummyEmailRepository.");
      emailRepository = new DummyEmailRepositoryImpl();
    }

    let paymentRepository: PaymentRepository;
    if (process.env.STRIPE_SECRET_KEY) {
      paymentRepository = new StripePaymentRepositoryImpl();
    } else {
      console.log("WARN: STRIPE_SECRET_KEY no configurada. Usando DummyPaymentRepository.");
      paymentRepository = new DummyPaymentRepo();
    }

    // Servicios
    const userService = new UserService(userRepository);
    const emailService = new EmailService(emailRepository);
    const paymentService = new PaymentService(paymentRepository); // <-- CORRECCIÓN 3: Solo 1 argumento

    // Registro
    this.services.set("UserService", userService);
    this.services.set("EmailService", emailService);
    this.services.set("PaymentService", paymentService);
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

// Instancias
export const userServiceInstance: UserPort = diContainer.get("UserService");
export const emailServiceInstance: EmailPort = diContainer.get("EmailService");
export const paymentServiceInstance: PaymentPortIn = diContainer.get("PaymentService"); // <-- CORRECCIÓN 1