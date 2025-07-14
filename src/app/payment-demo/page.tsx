"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import CheckoutButton from "@/components/CheckoutButton";

// Import dynamique pour éviter les erreurs SSR avec Stripe
const PaymentForm = dynamic(() => import("@/components/PaymentForm"), {
  ssr: false,
});

export default function PaymentDemoPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Démonstration des paiements Stripe</h1>

        {/* Messages de statut pour Checkout */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md text-center">
            ✅ Paiement réussi ! Merci pour votre achat.
          </div>
        )}

        {canceled && (
          <div className="mb-6 p-4 bg-yellow-100 text-yellow-700 rounded-md text-center">
            ⚠️ Paiement annulé. Vous pouvez réessayer quand vous le souhaitez.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Méthode 1: Payment Intent avec Elements */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-center">Méthode 1: Payment Intent + Elements</h2>
            <p className="text-gray-600 mb-6 text-center">Paiement intégré dans votre page avec Stripe Elements</p>
            <PaymentForm />
          </div>

          {/* Méthode 2: Checkout Session */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-center">Méthode 2: Checkout Session</h2>
            <p className="text-gray-600 mb-6 text-center">Redirection vers la page de paiement Stripe hébergée</p>
            <CheckoutButton />
          </div>
        </div>

        {/* Section d'information */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">ℹ️ Informations de test</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Cartes de test :</h4>
              <ul className="text-sm space-y-1">
                <li>
                  <code>4242 4242 4242 4242</code> - Visa (succès)
                </li>
                <li>
                  <code>4000 0000 0000 0002</code> - Carte refusée
                </li>
                <li>
                  <code>4000 0000 0000 9995</code> - Fonds insuffisants
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Autres informations :</h4>
              <ul className="text-sm space-y-1">
                <li>Date d&apos;expiration : n&apos;importe quelle date future</li>
                <li>CVC : n&apos;importe quel nombre à 3 chiffres</li>
                <li>Code postal : n&apos;importe quel code postal</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link href="/" className="inline-block bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
