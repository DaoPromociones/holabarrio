"use client";

import { useState } from "react";
import { usePayment } from "@/hooks/usePayment";

export default function CheckoutButton() {
  const { createCheckoutSession, loading, error } = usePayment();
  const [amount, setAmount] = useState(2500); // 25€ en centimes
  const [currency] = useState("eur");

  const handleCheckout = async () => {
    try {
      const session = await createCheckoutSession({
        amount,
        currency,
        successUrl: `${window.location.origin}/payment-demo?success=true`,
        cancelUrl: `${window.location.origin}/payment-demo?canceled=true`,
        metadata: {
          orderId: "order_123",
          customerId: "customer_456",
        },
      });

      if (session && session.url) {
        window.location.href = session.url;
      }
    } catch (error) {
      console.error("Erreur lors de la création de la session:", error);
    }
  };

  const getButtonLabel = (): string => {
    if (loading) {
      return "Redirection...";
    }
    return `Payer ${amount / 100}€ avec Checkout`;
  };

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white border rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Stripe Checkout</h3>
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
        <div className="mt-4 text-sm text-gray-600">
          <p>Cette méthode vous redirige vers la page de paiement sécurisée de Stripe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white border rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Stripe Checkout</h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="checkoutAmount" className="block text-sm font-medium mb-1">
            Montant (en centimes)
          </label>
          <input
            type="number"
            id="checkoutAmount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <p className="text-sm text-gray-500 mt-1">{amount / 100}€</p>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {getButtonLabel()}
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Cette méthode vous redirige vers la page de paiement sécurisée de Stripe.</p>
      </div>
    </div>
  );
}
