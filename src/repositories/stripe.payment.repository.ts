import Stripe from "stripe";
import { PaymentRepository } from "@/core/ports/out/payment.repository";
import { PaymentIntent, PaymentRequest, PaymentSession, CreateSessionRequest } from "@/core/models/payment";

export class StripePaymentRepositoryImpl implements PaymentRepository {
  private readonly stripe: Stripe;

  public constructor() {
    this.ensureStripeSecretKey();
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2025-05-28.basil",
    });
  }

  private ensureStripeSecretKey(): void {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY n'est pas définie");
    }
  }

  public async createPaymentIntent(request: PaymentRequest): Promise<PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: request.amount,
      currency: request.currency,
      description: request.description,
      metadata: request.metadata,
      automatic_payment_methods: { enabled: true },
    });

    return this.mapStripePaymentIntent(paymentIntent);
  }

  public async confirmPayment(paymentIntentId: string): Promise<PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId);
    return this.mapStripePaymentIntent(paymentIntent);
  }

  public async createCheckoutSession(request: CreateSessionRequest): Promise<PaymentSession> {
    const sessionData = this.buildSessionData(request);
    const session = await this.stripe.checkout.sessions.create(sessionData);
    return this.mapStripeSession(session, request.amount, request.currency);
  }

  public async retrievePaymentIntent(paymentIntentId: string): Promise<PaymentIntent | null> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return this.mapStripePaymentIntent(paymentIntent);
    } catch (error) {
      this.logStripeError("récupération du PaymentIntent", error);
      return null;
    }
  }

  public async retrieveSession(sessionId: string): Promise<PaymentSession | null> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      return this.mapStripeSession(session, session.amount_total, session.currency);
    } catch (error) {
      this.logStripeError("récupération de la session", error);
      return null;
    }
  }

  private buildSessionData(request: CreateSessionRequest): Stripe.Checkout.SessionCreateParams {
    if (request.priceId) {
      return {
        success_url: request.successUrl,
        cancel_url: request.cancelUrl,
        metadata: request.metadata,
        mode: "payment",
        line_items: [
          {
            price: request.priceId,
            quantity: 1,
          },
        ],
      };
    }
    if (request.amount && request.currency) {
      return {
        success_url: request.successUrl,
        cancel_url: request.cancelUrl,
        metadata: request.metadata,
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: request.currency,
              unit_amount: request.amount,
              product_data: {
                name: "Paiement",
              },
            },
            quantity: 1,
          },
        ],
      };
    }
    throw new Error("Soit priceId soit amount/currency doit être fourni");
  }

  private mapStripePaymentIntent(paymentIntent: Stripe.PaymentIntent): PaymentIntent {
    if (!paymentIntent.client_secret) {
      throw new Error("Le client_secret du PaymentIntent est manquant");
    }
    return {
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      metadata: paymentIntent.metadata ?? undefined,
    };
  }

  private mapStripeSession(
    session: Stripe.Checkout.Session,
    amount?: number | null,
    currency?: string | null
  ): PaymentSession {
    if (!session.url) {
      throw new Error("L'URL de la session Stripe est manquante");
    }
    return {
      id: session.id,
      url: session.url,
      amount: typeof amount === "number" ? amount : 0,
      currency: typeof currency === "string" ? currency : "eur",
      status: session.status ?? "open",
      metadata: (session.metadata as Record<string, string>) ?? undefined,
    };
  }

  private logStripeError(context: string, error: unknown): void {
    if (error instanceof Error) {
      console.error(`Erreur lors de la ${context}:`, error.message);
      return;
    }
    console.error(`Erreur inconnue lors de la ${context}:`, error);
  }
}
