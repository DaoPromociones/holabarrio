import { NextResponse } from "next/server";
import { PaymentService } from "@/core/services/payment.service";
import { StripePaymentRepositoryImpl } from "@/repositories/stripe.payment.repository";

export async function POST(request: Request) {
  try {
    const { priceId, amount, currency, successUrl, cancelUrl, metadata } = await request.json();

    if (!successUrl || !cancelUrl) {
      return NextResponse.json({ error: "URLs de succès et d'annulation requises" }, { status: 400 });
    }

    const paymentService = new PaymentService(new StripePaymentRepositoryImpl());
    const session = await paymentService.createCheckoutSession({
      priceId,
      amount,
      currency,
      successUrl,
      cancelUrl,
      metadata,
    });

    return NextResponse.json(session);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
