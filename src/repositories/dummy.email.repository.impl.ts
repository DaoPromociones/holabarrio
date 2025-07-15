// src/repositories/dummy.email.repository.impl.ts
import { EmailRepository } from "@/core/ports/out/email.repository";

// Esta clase cumple el contrato pero sus métodos están vacíos o solo loguean.
export class DummyEmailRepositoryImpl implements EmailRepository {
  public async sendVerificationEmail(email: string, token: string, name: string): Promise<void> {
    console.log("--- DUMMY EMAIL ---");
    console.log(`Enviando email de verificación a: ${email}`);
    console.log(`Token: ${token}`);
    console.log("-------------------");
    // En desarrollo, no se envía ningún email real.
    return Promise.resolve();
  }

  public async sendPasswordResetEmail(email: string, token: string, name: string): Promise<void> {
    console.log("--- DUMMY EMAIL ---");
    console.log(`Enviando email de reseteo de contraseña a: ${email}`);
    console.log(`Token: ${token}`);
    console.log("-------------------");
    return Promise.resolve();
  }
}