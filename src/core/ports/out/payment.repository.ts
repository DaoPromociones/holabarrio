import { PaymentIntent, PaymentRequest, PaymentSession, CreateSessionRequest } from "@/core/models/payment";

export interface PaymentRepository {
  createPaymentIntent(request: PaymentRequest): Promise<PaymentIntent>;
  confirmPayment(paymentIntentId: string): Promise<PaymentIntent>;
  createCheckoutSession(request: CreateSessionRequest): Promise<PaymentSession>;
  retrievePaymentIntent(paymentIntentId: string): Promise<PaymentIntent | null>;
  retrieveSession(sessionId: string): Promise<PaymentSession | null>;
}
