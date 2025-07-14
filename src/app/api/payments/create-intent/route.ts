import { NextResponse } from "next/server";
import { PaymentService } from "@/core/services/payment.service";
import { StripePaymentRepositoryImpl } from "@/repositories/stripe.payment.repository";

export async function POST(request: Request) {
  try {
    const { amount, currency, description, metadata } = await request.json();

    if (!amount || !currency) {
      return NextResponse.json({ error: "Amount et currency sont requis" }, { status: 400 });
    }

    const paymentService = new PaymentService(new StripePaymentRepositoryImpl());
    const paymentIntent = await paymentService.createPaymentIntent({
      amount,
      currency,
      description,
      metadata,
    });

    return NextResponse.json(paymentIntent);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
