// src/repositories/dummy.payment.repository.impl.ts

import { PaymentIntent, PaymentRequest, PaymentSession, CreateSessionRequest } from "@/core/models/payment";
import { PaymentRepository } from "@/core/ports/out/payment.repository";

// Esta clase ahora cumple el contrato al 100%
export class DummyPaymentRepositoryImpl implements PaymentRepository {
  public async createPaymentIntent(request: PaymentRequest): Promise<PaymentIntent> {
    console.log("--- DUMMY PAYMENT ---", "createPaymentIntent llamado con:", request);
    return Promise.resolve({
      id: "pi_dummy_12345",
      clientSecret: "dummy_client_secret_for_testing",
      amount: request.amount,
      currency: request.currency,
      status: "succeeded",
    });
  }

  public async confirmPayment(paymentIntentId: string): Promise<PaymentIntent> {
    console.log("--- DUMMY PAYMENT ---", `confirmPayment llamado para: ${paymentIntentId}`);
    return Promise.resolve({
      id: paymentIntentId,
      clientSecret: "dummy_client_secret_for_testing",
      amount: 1000, // Dummy amount
      currency: "eur", // Dummy currency
      status: "succeeded",
    });
  }

  public async createCheckoutSession(request: CreateSessionRequest): Promise<PaymentSession> {
    console.log("--- DUMMY PAYMENT ---", "createCheckoutSession llamado con:", request);
    return Promise.resolve({
      id: "cs_dummy_12345",
      url: "https://holabarrio.es/pago/exito",
      amount: request.amount || 0,
      currency: request.currency || "eur",
      status: "complete",
    });
  }

  public async retrievePaymentIntent(paymentIntentId: string): Promise<PaymentIntent | null> {
    console.log("--- DUMMY PAYMENT ---", `retrievePaymentIntent llamado para: ${paymentIntentId}`);
    return Promise.resolve({
      id: paymentIntentId,
      clientSecret: "dummy_client_secret_for_testing",
      amount: 1000,
      currency: "eur",
      status: "succeeded",
    });
  }

  public async retrieveSession(sessionId: string): Promise<PaymentSession | null> {
    console.log("--- DUMMY PAYMENT ---", `retrieveSession llamado para: ${sessionId}`);
    return Promise.resolve({
      id: sessionId,
      url: "https://holabarrio.es/pago/exito",
      amount: 1000,
      currency: "eur",
      status: "complete",
    });
  }
}