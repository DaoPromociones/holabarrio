// src/repositories/resend.email.repository.impl.ts
import { EmailRepository } from "@/core/ports/out/email.repository";
import { Resend } from "resend";

export class ResendEmailRepositoryImpl implements EmailRepository {
  private readonly resend: Resend;

  public constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY no está definida en las variables de entorno");
    }
    this.resend = new Resend(apiKey);
  }

  public async sendVerificationEmail(email: string, token: string, name: string): Promise<void> {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

    await this.resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@holabarrio.es",
      to: [email],
      subject: "Verifica tu dirección de email",
      html: `<p>Hola ${name}, haz clic <a href="${verificationUrl}">aquí</a> para verificar tu email.</p>`,
    });
  }

  public async sendPasswordResetEmail(email: string, token:string, name: string): Promise<void> {
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    await this.resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@holabarrio.es",
      to: [email],
      subject: "Restablecer tu contraseña",
      html: `<p>Hola ${name}, haz clic <a href="${resetUrl}">aquí</a> para restablecer tu contraseña.</p>`,
    });
  }
}