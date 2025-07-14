import { NextResponse } from "next/server";
import { PaymentService } from "@/core/services/payment.service";
import { StripePaymentRepositoryImpl } from "@/repositories/stripe.payment.repository";

export async function POST(request: Request) {
  try {
    const { paymentIntentId } = await request.json();

    if (!paymentIntentId) {
      return NextResponse.json({ error: "PaymentIntent ID requis" }, { status: 400 });
    }

    const paymentService = new PaymentService(new StripePaymentRepositoryImpl());
    const paymentIntent = await paymentService.confirmPayment(paymentIntentId);

    return NextResponse.json(paymentIntent);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
