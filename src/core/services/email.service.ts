// src/core/services/email.service.ts
import { EmailPort } from "../ports/in/email.port";
import { EmailRepository } from "../ports/out/email.repository";

export class EmailService implements EmailPort {
  constructor(private readonly emailRepository: EmailRepository) {}

  async sendVerificationEmail(email: string, token: string, name: string): Promise<void> {
    await this.emailRepository.sendVerificationEmail(email, token, name);
  }

  async sendPasswordResetEmail(email: string, token: string, name: string): Promise<void> {
    await this.emailRepository.sendPasswordResetEmail(email, token, name);
  }
}