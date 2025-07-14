import {
  PaymentIntent,
  PaymentRequest,
  PaymentSession,
  CreateSessionRequest,
  isValidPaymentRequest,
} from "@/core/models/payment";
import { PaymentPortIn } from "@/core/ports/in/payment.port";
import { PaymentRepository } from "@/core/ports/out/payment.repository";

export class PaymentService implements PaymentPortIn {
  private readonly paymentRepo: PaymentRepository;

  public constructor(paymentRepo: PaymentRepository) {
    this.paymentRepo = paymentRepo;
  }

  public async createPaymentIntent(request: PaymentRequest): Promise<PaymentIntent> {
    if (!isValidPaymentRequest(request)) {
      throw new Error("Requête de paiement invalide");
    }
    return this.paymentRepo.createPaymentIntent(request);
  }

  public async confirmPayment(paymentIntentId: string): Promise<PaymentIntent> {
    if (!paymentIntentId) {
      throw new Error("ID du PaymentIntent requis");
    }
    return this.paymentRepo.confirmPayment(paymentIntentId);
  }

  public async createCheckoutSession(request: CreateSessionRequest): Promise<PaymentSession> {
    if (!request.successUrl) {
      throw new Error("URL de succès requise");
    }
    if (!request.cancelUrl) {
      throw new Error("URL d'annulation requise");
    }
    return this.paymentRepo.createCheckoutSession(request);
  }

  public async retrievePaymentIntent(paymentIntentId: string): Promise<PaymentIntent | null> {
    if (!paymentIntentId) {
      throw new Error("ID du PaymentIntent requis");
    }
    return this.paymentRepo.retrievePaymentIntent(paymentIntentId);
  }

  public async retrieveSession(sessionId: string): Promise<PaymentSession | null> {
    if (!sessionId) {
      throw new Error("ID de session requis");
    }
    return this.paymentRepo.retrieveSession(sessionId);
  }
}
