import { useState, useCallback } from "react";
import { PaymentIntent, PaymentRequest, PaymentSession, CreateSessionRequest } from "@/core/models/payment";

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentIntent = useCallback(async (request: PaymentRequest): Promise<PaymentIntent | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur inconnue");
      return data as PaymentIntent;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la création du paiement");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmPayment = useCallback(async (paymentIntentId: string): Promise<PaymentIntent | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur inconnue");
      return data as PaymentIntent;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la confirmation du paiement");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCheckoutSession = useCallback(async (request: CreateSessionRequest): Promise<PaymentSession | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur inconnue");
      return data as PaymentSession;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la création de la session");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const retrievePaymentIntent = useCallback(async (paymentIntentId: string): Promise<PaymentIntent | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/payments/retrieve-intent?id=${encodeURIComponent(paymentIntentId)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur inconnue");
      return data as PaymentIntent;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la récupération du paiement");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const retrieveSession = useCallback(async (sessionId: string): Promise<PaymentSession | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/payments/retrieve-session?id=${encodeURIComponent(sessionId)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur inconnue");
      return data as PaymentSession;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la récupération de la session");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createPaymentIntent,
    confirmPayment,
    createCheckoutSession,
    retrievePaymentIntent,
    retrieveSession,
  };
}
